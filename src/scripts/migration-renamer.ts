import * as fs from 'fs';
import * as path from 'path';
import { config } from 'dotenv';

// Load environment variables
const envPath = `.env.${process.env.NODE_ENV || 'dev'}`;
config({ path: path.resolve(process.cwd(), envPath) });

interface MigrationFile {
  originalName: string;
  timestamp: number;
  descriptiveName: string;
}

class MigrationRenamer {
  private readonly MIGRATIONS_DIR = path.join(__dirname, '../migrations');
  private readonly FILE_EXTENSION = '.ts';

  private parseMigrationFileName(fileName: string): MigrationFile | null {
    const match = fileName.match(/^(\d+)-(.+)\.ts$/);
    if (!match) return null;

    return {
      originalName: fileName,
      timestamp: parseInt(match[1], 10),
      descriptiveName: match[2],
    };
  }

  private async updateMigrationContent(
    filePath: string,
    oldFileName: string,
    newFileName: string,
  ): Promise<void> {
    const content = await fs.promises.readFile(filePath, 'utf8');

    // Remove file extension and convert dashes to underscores for class name
    const newClassNameBase = newFileName.split('.')[0].replace(/-/g, '_');
    const oldTimestamp = oldFileName.split('-')[0];

    // Replace old timestamp-based class name with new sequential number-based name
    const updatedContent = content.replace(
      new RegExp(`class\\s+[a-zA-Z_]*${oldTimestamp}[a-zA-Z_]*`, 'g'),
      `class Migration_${newClassNameBase}`,
    );

    await fs.promises.writeFile(filePath, updatedContent);
  }

  public async renameMigrations(): Promise<void> {
    try {
      // Ensure migrations directory exists
      if (!fs.existsSync(this.MIGRATIONS_DIR)) {
        throw new Error(
          `Migrations directory not found: ${this.MIGRATIONS_DIR}`,
        );
      }

      // Read and parse all migration files
      const files = await fs.promises.readdir(this.MIGRATIONS_DIR);
      const migrationFiles = files
        .filter((file) => file.endsWith(this.FILE_EXTENSION))
        .map((file) => this.parseMigrationFileName(file))
        .filter((file): file is MigrationFile => file !== null)
        .sort((a, b) => a.timestamp - b.timestamp);

      // Rename files with sequential numbers
      for (let i = 0; i < migrationFiles.length; i++) {
        const file = migrationFiles[i];
        const fileNumber = (i + 1).toString().padStart(3, '0');
        const newFileName = `${fileNumber}-${file.descriptiveName}${this.FILE_EXTENSION}`;

        const oldPath = path.join(this.MIGRATIONS_DIR, file.originalName);
        const newPath = path.join(this.MIGRATIONS_DIR, newFileName);

        // Rename the file
        await fs.promises.rename(oldPath, newPath);

        // Update the content of the file
        await this.updateMigrationContent(
          newPath,
          file.originalName,
          newFileName,
        );

        console.log(`Renamed: ${file.originalName} → ${newFileName}`);
      }

      console.log('\nMigration files have been successfully renamed!');
      console.log('Important notes:');
      console.log('1. Update your migrations table in the database if needed');
      console.log('2. Commit all changes to version control');
      console.log('3. Inform team members about the changes');
    } catch (error) {
      console.error('Error renaming migration files:', error);
      throw error;
    }
  }
}

// Execute if this file is run directly
if (require.main === module) {
  const renamer = new MigrationRenamer();
  renamer.renameMigrations().catch((error) => {
    console.error('Failed to rename migrations:', error);
    process.exit(1);
  });
}

export default MigrationRenamer;
