import { exec } from 'child_process';

export function prismaReset(dbUrl: string): Promise<string> {
  return new Promise((resolve, reject) =>
    exec(
      `DATABASE_URL=${dbUrl} yarn prisma migrate reset --force`,
      (err, stdout) => {
        if (err) {
          reject(err);
        } else {
          resolve(stdout);
        }
      },
    ),
  );
}
