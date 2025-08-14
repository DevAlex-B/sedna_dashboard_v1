import fs from 'fs';
import path from 'path';

test('users table upsert present', () => {
  const p = path.resolve(__dirname, '../../api/visitor.php');
  const content = fs.readFileSync(p, 'utf8');
  expect(content).toMatch(/INSERT INTO users \(full_name, email, dashboard_visitor\)/);
  expect(content).toMatch(/ON DUPLICATE KEY UPDATE/);
});
