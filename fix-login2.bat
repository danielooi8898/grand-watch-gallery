@echo off
cd /d "C:\Users\USER\Desktop\GWG Website Development\grand-watch-gallery"
git add src/app/admin/login/page.js > output.txt 2>&1
git status >> output.txt 2>&1
git commit -m "fix: wait for auth state before redirecting after login" >> output.txt 2>&1
git push origin main >> output.txt 2>&1
echo DONE >> output.txt 2>&1
