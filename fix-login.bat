@echo off
cd /d "C:\Users\USER\Desktop\GWG Website Development\grand-watch-gallery"
git add src/app/admin/login/page.js
git status
git commit -m "fix: wait for auth state before redirecting after login"
git push origin main
echo DONE
