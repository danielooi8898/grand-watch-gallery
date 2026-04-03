@echo off
set GIT="C:\Program Files\Git\cmd\git.exe"
cd /d "C:\Users\USER\Desktop\GWG Website Development\grand-watch-gallery"
%GIT% add src/app/admin/login/page.js > output.txt 2>&1
%GIT% status >> output.txt 2>&1
%GIT% commit -m "fix: wait for auth state before redirecting after login" >> output.txt 2>&1
%GIT% push origin main >> output.txt 2>&1
echo DONE >> output.txt 2>&1
