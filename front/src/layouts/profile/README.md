# Profile Navigation Component

## Overview
This directory contains the profile navigation sidebar component that provides a unique navigation experience for user account management.

## Components

### ProfileNavVertical
A specialized vertical navigation sidebar for the profile section with:
- Header with "ACCOUNT" text and yellow decorative lines
- Search functionality to filter navigation items  
- Section-based navigation with icons and labels
- "BET" separator in the middle of the navigation
- Responsive design for mobile and desktop

## Features
- **Custom Header**: Yellow decorative lines with "ACCOUNT" text
- **Search Bar**: Filter navigation items by typing
- **Icon-based Navigation**: Icons from `/public/assets/icons/leftbar-profile/`
- **Responsive Layout**: Adapts to mobile with drawer functionality
- **Section Switching**: Dynamically switches content based on selected section

## Usage

```tsx
import { ProfileNavVertical } from 'src/layouts/profile';

function AccountView() {
  const [selectedSection, setSelectedSection] = useState('personal');
  const profileNav = useBoolean();

  return (
    <Box sx={{ display: 'flex' }}>
      <ProfileNavVertical
        openNav={profileNav.value}
        onCloseNav={profileNav.onFalse}
        selectedSection={selectedSection}
        onSectionChange={setSelectedSection}
      />
      {/* Main content here */}
    </Box>
  );
}
```

## Navigation Items
- Personal Info (personal)
- Wallet (wallet)
- Security (security)
- Bonus (bonus)
- Notifications (notifications)
- History (history)
- Settings (settings)

## Styling
- Background: `#232626`
- Accent color: `#24ee89` (yellow)
- Width: 280px on desktop
- Border: `#2B2F3D`

## Icons
Icons are stored in `/public/assets/icons/leftbar-profile/` and include:
- account.svg
- wallet.svg
- security.svg
- bonus.svg
- notifications.svg
- history.svg
- settings.svg