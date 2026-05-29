const fs = require('fs');

function replaceColors(file) {
  let content = fs.readFileSync(file, 'utf8');
  content = content.replace(/#09090b/g, 'var(--background)');
  content = content.replace(/#18181b/g, 'var(--card)');
  content = content.replace(/#27272a/g, 'var(--border)');
  content = content.replace(/#fafafa/g, 'var(--foreground)');
  content = content.replace(/#a1a1aa/g, 'var(--muted-foreground)');
  content = content.replace(/#52525b/g, 'var(--muted-foreground)');
  content = content.replace(/#71717a/g, 'var(--muted-foreground)');
  content = content.replace(/#3f3f46/g, 'var(--border)');
  fs.writeFileSync(file, content);
}

replaceColors('src/pages/Dashboard.tsx');
replaceColors('src/pages/Overview.tsx');
replaceColors('src/pages/ScheduleView.tsx');
replaceColors('src/pages/DutyView.tsx');
replaceColors('src/pages/FormsView.tsx');
replaceColors('src/pages/AdminDashboard.tsx');
// replaceColors('src/components/Shared.tsx');
