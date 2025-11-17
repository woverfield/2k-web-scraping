# Deployment Guide

This guide walks through deploying the NBA 2K Ratings API to production.

## Prerequisites

- GitHub account
- Vercel account (free tier works)
- Convex account (free tier works)
- Node.js 18+ installed locally

## Step 1: Deploy Convex Backend

### 1.1 Create Convex Production Deployment

```bash
cd frontend
npx convex deploy
```

This will:
- Create a production deployment on Convex Cloud
- Push your schema and functions
- Generate a production deployment URL

### 1.2 Note Your Deployment URL

After deployment, you'll see:
```
Deployment URL: https://your-deployment.convex.cloud
```

Save this URL - you'll need it for Vercel.

### 1.3 Configure Environment Variables (Optional)

If you need environment variables in Convex:

```bash
npx convex env set VARIABLE_NAME value
```

## Step 2: Deploy Frontend to Vercel

### 2.1 Push to GitHub

```bash
git add .
git commit -m "Prepare for production deployment"
git push origin main
```

### 2.2 Import Project to Vercel

1. Go to [vercel.com](https://vercel.com/)
2. Click "Add New..." → "Project"
3. Import your GitHub repository
4. Vercel will auto-detect Next.js

### 2.3 Configure Build Settings

Vercel should auto-detect these settings from `vercel.json`:
- **Framework Preset**: Next.js
- **Root Directory**: `./` (project root)
- **Build Command**: `cd frontend && npm install && npm run build`
- **Output Directory**: `frontend/.next`

### 2.4 Add Environment Variables

In Vercel project settings, add:

| Variable | Value |
|----------|-------|
| `NEXT_PUBLIC_CONVEX_URL` | Your Convex deployment URL from Step 1.2 |

### 2.5 Deploy

Click "Deploy" and wait for the build to complete (usually 2-3 minutes).

## Step 3: Verify Deployment

### 3.1 Check Frontend

Visit your Vercel deployment URL:
```
https://your-project.vercel.app
```

Verify:
- [ ] Landing page loads
- [ ] Live stats show data
- [ ] Player search works
- [ ] Can create API key
- [ ] Dashboard loads

### 3.2 Test API Endpoints

```bash
# Get your API key from the dashboard first
export API_KEY="your_api_key"

# Test stats endpoint (no auth required)
curl https://your-deployment.convex.site/api/stats

# Test player search
curl -H "X-API-Key: $API_KEY" \
  'https://your-deployment.convex.site/api/players?search=lebron'

# Test specific player
curl -H "X-API-Key: $API_KEY" \
  'https://your-deployment.convex.site/api/players/lebron-james'
```

### 3.3 Check Dashboard

1. Visit `/dashboard`
2. Create or load your API key
3. Verify usage stats appear
4. Make a test API request
5. Verify it appears in "Recent Requests"

## Step 4: Custom Domain (Optional)

### 4.1 Add Domain in Vercel

1. Go to Project Settings → Domains
2. Add your domain (e.g., `nba2k-api.com`)
3. Follow DNS configuration instructions

### 4.2 Update Documentation

Update README.md and landing page with your custom domain.

## Step 5: Set Up Automated Scraping

### Option A: GitHub Actions (Recommended)

Create `.github/workflows/scrape.yml`:

```yaml
name: Scrape NBA 2K Data
on:
  schedule:
    # Run every Sunday at midnight UTC
    - cron: '0 0 * * 0'
  workflow_dispatch: # Allow manual triggers

jobs:
  scrape:
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v3

      - uses: actions/setup-node@v3
        with:
          node-version: '18'

      - name: Install dependencies
        run: npm install

      - name: Install Playwright
        run: npx playwright install chromium

      - name: Run scraper
        env:
          CONVEX_URL: ${{ secrets.CONVEX_URL }}
        run: node scripts/runScraper.js all
```

Add `CONVEX_URL` secret in GitHub repository settings.

### Option B: Vercel Cron Jobs

Create `vercel.json` cron config:

```json
{
  "crons": [{
    "path": "/api/cron/scrape",
    "schedule": "0 0 * * 0"
  }]
}
```

Create API route in Next.js to trigger scraping.

### Option C: Manual Scraping

Run locally when needed:

```bash
CONVEX_URL=https://your-deployment.convex.cloud \
  node scripts/runScraper.js all
```

## Step 6: Monitoring and Maintenance

### 6.1 Monitor Convex Dashboard

Visit [dashboard.convex.dev](https://dashboard.convex.dev) to:
- Check function execution logs
- Monitor database size
- View API usage
- Set up alerts

### 6.2 Monitor Vercel Analytics

In Vercel dashboard:
- View deployment logs
- Check build times
- Monitor traffic
- Review errors

### 6.3 Regular Maintenance

Weekly:
- [ ] Run scraper to update player data
- [ ] Check error logs in Convex
- [ ] Verify API endpoints working

Monthly:
- [ ] Review rate limit settings
- [ ] Check database size
- [ ] Update dependencies

## Troubleshooting

### Build Fails on Vercel

**Error**: "Module not found"
- **Solution**: Ensure all dependencies in `frontend/package.json`
- Run `cd frontend && npm install` locally to verify

**Error**: "NEXT_PUBLIC_CONVEX_URL is not defined"
- **Solution**: Add environment variable in Vercel project settings

### API Returns 500 Errors

**Check Convex Logs**:
1. Go to Convex dashboard
2. View function logs
3. Look for error messages

**Common Issues**:
- Invalid Convex URL in frontend
- Schema not deployed to production
- Missing environment variables

### Dashboard Shows "Failed to load data"

**Verify**:
- [ ] API key is valid
- [ ] Convex deployment is running
- [ ] Network tab shows successful requests
- [ ] CORS is not blocking requests

### Scraper Fails

**Common Issues**:
- Playwright not installed: `npx playwright install chromium`
- Invalid Convex URL: Check `CONVEX_URL` environment variable
- Rate limiting from 2kratings.com: Add delays in scraper
- Website structure changed: Update selectors in scraper

## Rollback Plan

If deployment has issues:

### Rollback Frontend (Vercel)
1. Go to Deployments tab
2. Find previous working deployment
3. Click "..." → "Promote to Production"

### Rollback Backend (Convex)
```bash
cd frontend
npx convex deploy --cmd "restore <snapshot-id>"
```

Get snapshot ID from Convex dashboard backups.

## Performance Optimization

### Frontend
- Enable Vercel Analytics for insights
- Use ISR (Incremental Static Regeneration) for player pages
- Implement proper caching headers

### Backend
- Add database indexes for common queries
- Implement query result caching
- Monitor Convex function execution times

### API
- Enable CDN caching for static data
- Implement ETag support (already done)
- Consider upgrading rate limits for premium users

## Security Checklist

- [ ] Environment variables are secret (not in code)
- [ ] API keys are properly validated
- [ ] Rate limiting is active
- [ ] CORS is properly configured
- [ ] No sensitive data in client-side code
- [ ] GitHub secrets are properly set
- [ ] Admin endpoints are protected

## Cost Estimation

### Free Tier Limits

**Convex (Free)**:
- 1M function calls/month
- 1 GB database storage
- 10 GB bandwidth

**Vercel (Free)**:
- 100 GB bandwidth/month
- Unlimited deployments
- 6,000 build minutes/month

**Typical Usage**:
- ~1000 API requests/day = 30K/month
- Well within free tier limits

## Next Steps

After successful deployment:

1. Update README with production URLs
2. Announce API availability
3. Monitor usage and errors
4. Gather user feedback
5. Plan feature additions

## Support

Issues with deployment?
- Check [Convex docs](https://docs.convex.dev)
- Check [Vercel docs](https://vercel.com/docs)
- Open GitHub issue
