# Class Scheduler

Personal class scheduling app built with React, TypeScript, and Vite.

## Run Locally On Windows

If you just installed Node.js, close and reopen PowerShell first.

Then run:

```powershell
npm.cmd install
npm.cmd run dev
```

Open:

```txt
http://127.0.0.1:5173/
```

If PowerShell still cannot find Node/npm, use the included helper:

```powershell
.\dev.cmd
```

The `.cmd` helper calls npm from the default Node install folder, installs dependencies if needed, and starts the app.

If you want to run npm directly while your terminal still cannot find it, use the full path:

```powershell
& "C:\Program Files\nodejs\npm.cmd" install
& "C:\Program Files\nodejs\npm.cmd" run dev
```
