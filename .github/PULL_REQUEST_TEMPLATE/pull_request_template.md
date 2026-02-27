## 📋 Summary

<!-- A clear, concise description of what this PR does and why. -->

Closes #<!-- issue number -->

---

## 🔍 Type of Change

<!-- Check all that apply -->

- [ ] 🐛 Bug fix (non-breaking change that fixes an issue)
- [ ] 🚀 New feature (non-breaking change that adds functionality)
- [ ] 💥 Breaking change (fix or feature that causes existing functionality to change)
- [ ] 🔒 Security fix
- [ ] ♻️ Refactor (no functional change)
- [ ] 📖 Documentation update
- [ ] 🧪 Test addition or improvement
- [ ] 🔧 Build / CI / DevOps change

---

## 🧠 What Changed

<!-- List the key changes made in this PR. Be specific about files and logic. -->

**Backend:**
- 

**Frontend:**
- 

**Other:**
- 

---

## 🧪 How to Test

<!-- Step-by-step instructions for reviewing this PR manually. -->

1. Checkout this branch: `git checkout <branch-name>`
2. 
3. 

**Expected result:**  

---

## 📸 Screenshots / Videos (if UI change)

<!-- Add before/after screenshots for any visual changes -->

| Before | After |
|--------|-------|
| | |

---

## 🔒 Security Checklist

<!-- For any changes that touch auth, investments, or user data -->

- [ ] No sensitive data (secrets, PII) logged or exposed in responses
- [ ] Input is validated and sanitized
- [ ] Authorization checks are in place (not just authentication)
- [ ] New endpoints are rate-limited if appropriate
- [ ] Database queries use parameterized inputs (no string concatenation)

---

## ✅ General Checklist

- [ ] My code follows the existing architecture (Controller → Service → Repository)
- [ ] I have not added any `console.log` statements left over from debugging
- [ ] All new environment variables are added to `.env.example`
- [ ] API responses use the standard `success()`/`failure()` response helpers
- [ ] Errors use the typed `Errors.*` factory functions from `utils/errors.js`
- [ ] Any new audit-worthy actions are logged via `auditRepo.log()`
- [ ] I have manually tested the happy path and at least one error case
- [ ] I have updated the README if setup steps changed

---

## 📝 Notes for Reviewer

<!-- Anything the reviewer should pay special attention to, tradeoffs made, or questions you have. -->
