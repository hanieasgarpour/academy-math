---
Task ID: 1
Agent: full-stack-developer
Task: Fix hamburger menu, add admin user, add toast notifications, improve checkout

Work Log:
- Added `role?: "admin" | "user"` field to User interface in `/home/z/my-project/src/store/use-store.ts`
- Replaced Sheet-based mobile menu with custom RTL-friendly drawer using Framer Motion AnimatePresence and CSS transitions
- Custom drawer slides from right (correct for RTL), uses overlay click-to-close, body scroll lock, and proper z-index layering
- Added admin login support: `admin@erfan.ir` / `admin123` creates user with role "admin" and name "مدیر آکادمی"
- Added admin badge ("ادمین") in Navbar (desktop), mobile menu drawer, and ProfilePage header
- Added toast notifications using existing `useToast` hook for:
  - Adding item to cart (سبد خرید اضافه شد)
  - Removing item from cart (از سبد خرید حذف شد)
  - Login success (ورود موفق)
  - Registration success (ثبت‌نام موفق)
  - Logout success (خروج موفق)
  - Checkout success (خرید موفق)
- Improved cart checkout flow:
  - Converts all cart items to proper PurchasedItem records with correct types
  - Class items include skyroomUrl from the classes data
  - Video package items include a downloadUrl
  - Booklet items include a downloadUrl
  - Shows success toast after checkout
  - Shows success Dialog with options to view purchases or close
  - Clears cart after successful checkout
- Removed Sheet component imports (no longer needed)
- Added PurchasedItem import from store
- Added useToast import from hooks
- Lint check passes with no errors
- Server compiles successfully and returns 200

Stage Summary:
- Hamburger menu now uses custom RTL-friendly drawer instead of broken Sheet component
- Admin account (admin@erfan.ir / admin123) works with role badge display
- Toast notifications provide visual feedback for all key user actions
- Checkout flow properly creates purchase records with correct URLs and shows success dialog
- All changes preserve existing orange theme, data, and layout
