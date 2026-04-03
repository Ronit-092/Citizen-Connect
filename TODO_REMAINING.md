# TODO: Remaining Tasks for CitizenCare

## ✅ Completed Components
- [x] Backend API structure (auth, complaints, users)
- [x] Database models (User, Complaint)
- [x] Shared TypeScript types and interfaces
- [x] API service layer (`client/lib/api.ts`)
- [x] Custom React hooks (useAuth, useComplaints)
- [x] CitizenLogin page - fully integrated
- [x] CitizenSignup page - fully integrated
- [x] GovtLogin page - fully integrated
- [x] CitizenDashboard - fully integrated with API
- [x] Error handling and loading states
- [x] Token management and auth persistence
- [x] Environment configuration templates

---

## 🔧 HIGH PRIORITY - Must Complete

### 1. **GovtDashboard Full Integration** (pages/GovtDashboard.tsx)
**Current Status**: Partially styled, no API connection

**Required Changes**:
```typescript
// Add hooks
import { useComplaints } from "@/hooks/use-complaints";
import { useAuth } from "@/hooks/use-auth";

// Add state management
const { complaints, loading, updateStatus, addRemark, fetchByStatus } = useComplaints();
const { user, logout } = useAuth();

// Add these features:
- [ ] Fetch complaints by status on mount
- [ ] Filter by category
- [ ] Update complaint status with modal dialog
- [ ] Add remarks/notes to complaints
- [ ] Assign complaints to self
- [ ] Display government-specific stats
- [ ] View complaint details in modal
- [ ] Search and pagination
```

**Implementation Needed**:
```typescript
useEffect(() => {
  if (!isAuthenticated) {
    navigate("/govt-login");
    return;
  }
  fetchByStatus('pending');
}, []);

const handleStatusUpdate = async (complaintId, newStatus, remarks) => {
  await updateStatus(complaintId, newStatus, remarks);
  await fetchByStatus(selectedStatus);
};
```

---

### 2. **Protected Routes (Route Guards)**
**Current Status**: No protection, anyone can access any page

**Required Implementation**:
```typescript
// Create: client/components/ProtectedRoute.tsx
interface ProtectedRouteProps {
  requiredRole?: 'citizen' | 'government';
  element: React.ReactElement;
}

export const ProtectedRoute = ({ element, requiredRole }: ProtectedRouteProps) => {
  const { isAuthenticated, user } = useAuth();
  
  if (!isAuthenticated) return <Navigate to="/citizen-login" />;
  if (requiredRole && user?.role !== requiredRole) {
    return <Navigate to="/" />;
  }
  return element;
};
```

**Update App.tsx**:
```typescript
<Route 
  path="/citizen-dashboard" 
  element={<ProtectedRoute requiredRole="citizen" element={<CitizenDashboard />} />} 
/>
<Route 
  path="/govt-dashboard" 
  element={<ProtectedRoute requiredRole="government" element={<GovtDashboard />} />} 
/>
```

---

### 3. **ComplaintModal File Upload Fix** (components/ComplaintModal.tsx)
**Current Status**: Form structure exists, file upload needs testing

**Required**:
- [ ] Test image file upload to Cloudinary
- [ ] Add file preview before upload
- [ ] Add file size validation (max 5MB)
- [ ] Add file type validation (images only)
- [ ] Show upload progress

---

### 4. **Complaint Detail View**
**Current Status**: No detail page exists

**Required**:
- [ ] Create `pages/ComplaintDetail.tsx`
- [ ] Fetch single complaint by ID
- [ ] Display full complaint with all remarks
- [ ] Show timeline of status changes
- [ ] Add citizen reply functionality
- [ ] Add government remarks section
- [ ] Show images in gallery

---

### 5. **Toast Notifications**
**Current Status**: UI component exists but not integrated

**Required**:
- [ ] Toast on successful login
- [ ] Toast on complaint created
- [ ] Toast on status updated
- [ ] Toast on remark added
- [ ] Toast on errors
- [ ] Use `sonner` package (already installed)

**Example**:
```typescript
import { toast } from "sonner";

toast.success("Complaint created successfully!");
toast.error("Failed to update status");
```

---

## 🎨 MEDIUM PRIORITY - Enhance UX

### 6. **Map Integration** (components/LeafletMap.tsx)
**Current Status**: Component exists, may need refinement

**Required**:
- [ ] Test map display
- [ ] Test location selection
- [ ] Test reverse geocoding
- [ ] Handle location permission errors
- [ ] Display complaint locations on map
- [ ] Show clustering for multiple complaints

---

### 7. **Complaint Filtering & Search**
**Current Status**: Basic filter exists in CitizenDashboard

**Required**:
- [ ] Add multiple filter combination
- [ ] Add date range filter
- [ ] Add priority filter
- [ ] Add department filter (for govt)
- [ ] Add sort options (date, status, priority)
- [ ] Save filters in URL params (for sharing)

---

### 8. **Pagination UI**
**Current Status**: Backend supports pagination, frontend doesn't show controls

**Required**:
- [ ] Add pagination controls
- [ ] Show current page and total pages
- [ ] Add "Load more" button or page navigation
- [ ] Show results per page
- [ ] Remember pagination on filter changes

---

### 9. **Loading Skeletons**
**Current Status**: Simple loading spinner exists

**Required**:
- [ ] Create skeleton loaders for complaint cards
- [ ] Create skeleton for complaint details
- [ ] Better visual feedback during loading

---

### 10. **Image Gallery for Complaints**
**Current Status**: No image display

**Required**:
- [ ] Create image gallery component
- [ ] Display complaint images in detail view
- [ ] Add lightbox functionality
- [ ] Add image upload in remarks

---

## 🔐 LOW PRIORITY - Security & Optimization

### 11. **Session Management**
**Current Status**: Basic token in localStorage

**Improvements**:
- [ ] Move to httpOnly cookies (more secure)
- [ ] Implement token refresh mechanism
- [ ] Add logout on token expiry
- [ ] Add session timeout warning

---

### 12. **Input Validation with Zod**
**Current Status**: Basic HTML5 validation only

**Required**:
- [ ] Add Zod schemas for auth forms
- [ ] Add Zod schemas for complaint forms
- [ ] Display validation errors inline
- [ ] Real-time validation feedback

**Example**:
```typescript
import { z } from 'zod';

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

const { errors, isValid } = await loginSchema.parseAsync(formData);
```

---

### 13. **Rate Limiting**
**Current Status**: Not implemented

**Required**:
- [ ] Add rate limiting to backend (express-rate-limit)
- [ ] Add rate limiting to frontend API calls
- [ ] Show rate limit errors gracefully

---

### 14. **Caching**
**Current Status**: No caching

**Improvements**:
- [ ] Cache user profile
- [ ] Cache complaints list
- [ ] Invalidate cache on updates
- [ ] Use React Query for advanced caching

---

### 15. **Error Boundary**
**Current Status**: No error boundary

**Required**:
- [ ] Create error boundary component
- [ ] Catch unhandled errors
- [ ] Show friendly error message
- [ ] Add error logging/reporting

---

## 📊 Analytics & Monitoring

### 16. **Government Statistics Dashboard**
**Current Status**: API endpoint exists, no UI

**Required**:
- [ ] Create stats page (`pages/Statistics.tsx`)
- [ ] Display complaint statistics
- [ ] Show charts/graphs (use recharts)
- [ ] Filter stats by date range
- [ ] Export reports (CSV/PDF)

---

### 17. **Activity Logging**
**Current Status**: Not implemented

**Required**:
- [ ] Log all complaint actions
- [ ] Log status changes
- [ ] Track who made changes and when
- [ ] Display activity timeline

---

## 🧪 Testing

### 18. **Unit Tests**
**Current Status**: Not started

**Required**:
- [ ] Test API service functions
- [ ] Test hooks (useAuth, useComplaints)
- [ ] Test components
- [ ] Use Vitest (already configured)

---

### 19. **E2E Tests**
**Current Status**: Not started

**Required**:
- [ ] Test full user flow (signup → login → create complaint)
- [ ] Test government flow (view → update → add remark)
- [ ] Use Playwright or Cypress

---

## 📱 Responsive Design

### 20. **Mobile Optimization**
**Current Status**: Responsive classes exist, may need testing

**Required**:
- [ ] Test on actual mobile devices
- [ ] Fix touch interactions
- [ ] Optimize modal sizes for mobile
- [ ] Test map on mobile
- [ ] Test file upload on mobile

---

## 📚 Documentation

### 21. **API Documentation**
**Current Status**: Basic comments in code

**Required**:
- [ ] Create Swagger/OpenAPI docs
- [ ] Document request/response examples
- [ ] Document error codes
- [ ] Create API quick reference

---

### 22. **Setup Guide**
**Current Status**: Basic README exists

**Required**:
- [ ] Detailed setup instructions
- [ ] Environment variable explanations
- [ ] Database setup instructions
- [ ] Troubleshooting guide

---

## 🚀 Deployment

### 23. **Production Build**
**Current Status**: Build scripts exist

**Required**:
- [ ] Test production build
- [ ] Set environment variables
- [ ] Configure CORS properly
- [ ] Set secure headers
- [ ] Enable HTTPS

---

### 24. **Deployment Platforms**
**Current Status**: Netlify integration mentioned in docs

**Required**:
- [ ] Deploy to Netlify (frontend)
- [ ] Deploy to Vercel (alternative)
- [ ] Deploy to Heroku or Railway (backend)
- [ ] Set up CI/CD pipeline

---

## 📋 Priority Order for Development

**This Week (Sprint 1)**:
1. GovtDashboard API integration
2. Protected routes
3. Toast notifications
4. Test all login flows

**Next Week (Sprint 2)**:
5. Complaint detail view
6. Image gallery
7. Advanced filtering
8. Pagination UI

**Week 3 (Sprint 3)**:
9. Statistics dashboard
10. Input validation (Zod)
11. Error boundaries
12. Unit tests

**Week 4 (Sprint 4)**:
13. E2E tests
14. Mobile optimization
15. Documentation
16. Production deployment

---

## Quick Wins (Easy to Implement)

These can be done anytime:
- [ ] Add toast notifications to existing flows
- [ ] Add loading skeletons
- [ ] Add more error messages
- [ ] Improve styling/colors
- [ ] Add help tooltips
- [ ] Add keyboard shortcuts
- [ ] Add dark/light theme toggle

---

## Files Ready for Next Steps

### Files that need completion:
1. `client/pages/GovtDashboard.tsx` - 70% done, needs API
2. `client/components/ComplaintModal.tsx` - 90% done, needs testing
3. `client/components/LeafletMap.tsx` - Needs testing

### Files ready to extend:
1. `shared/api.ts` - Add more types as needed
2. `client/lib/api.ts` - Add more endpoints
3. `client/hooks/*` - Add more custom hooks

### New files to create:
1. `client/components/ProtectedRoute.tsx`
2. `client/pages/ComplaintDetail.tsx`
3. `client/pages/Statistics.tsx`
4. `client/components/ErrorBoundary.tsx`
5. `server/models/Activity.js` (optional)

---

## Status Summary

**Frontend**: 85% Complete
- Authentication: ✅ 100%
- Citizen Dashboard: ✅ 100%
- Govt Dashboard: ⚠️ 50% (API connection needed)
- Protected Routes: ❌ 0%
- Other features: ⚠️ 30%

**Backend**: 95% Complete
- Authentication: ✅ 100%
- Complaints API: ✅ 100%
- Error Handling: ✅ 100%
- File Upload: ✅ 100%

**Integration**: 85% Complete
- Types & Interfaces: ✅ 100%
- API Service: ✅ 100%
- Hooks: ✅ 100%
- Data Flow: ✅ 100%
- Error Handling: ✅ 100%

**Testing**: ❌ 0% Complete

**Deployment**: ❌ 0% Complete

---

*Last Updated: December 6, 2024*
*Next Review: After GovtDashboard completion*
