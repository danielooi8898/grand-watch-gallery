@echo off
set GIT="C:\Program Files\Git\cmd\git.exe"
cd /d "C:\Users\USER\Desktop\GWG Website Development\grand-watch-gallery"
%GIT% add src/app/admin/layout.js src/app/admin/page.js src/app/admin/blog/page.js src/app/admin/content/page.js src/app/admin/settings/page.js src/app/admin/collection/page.js "src/app/admin/collection/[id]/page.js" src/app/collection/page.js "src/app/collection/[id]/page.js" > output.txt 2>&1
%GIT% commit -m "fix: rename Loader2 to LoaderCircle for lucide-react v0.577" >> output.txt 2>&1
%GIT% push origin main >> output.txt 2>&1
echo DONE >> output.txt 2>&1
