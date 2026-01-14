# Match Component Architecture

This directory contains the refactored LiveMatch component, which has been split into smaller, more manageable components for better maintainability and reusability.

## Component Structure

### Main Components

1. **LiveMatch.tsx** - The main container component that orchestrates all sub-components
   - Manages state for active tab selection
   - Handles data processing and transformation from API
   - Passes processed data to child components

2. **MatchHeader.tsx** - Displays match header with team information
   - Team names and crests
   - Current score
   - Background decorations
   - Action buttons (play, ground)
   - Accepts children (tabs and content)

3. **TabNavigation.tsx** - Tab navigation component
   - Stats, Timeline, Table, Lineups tabs
   - Active tab highlighting
   - Responsive design

4. **MatchStats.tsx** - Match statistics display
   - Main statistics (Attacks, Dangerous Attacks, Possession)
   - Detailed statistics (Shots, Corners, Cards)
   - Additional statistics (when available from API)
   - Visual progress bars and indicators

5. **MatchTimeline.tsx** - Timeline of match events
   - Progress bar showing match progression
   - Event list with icons
   - Expandable event list (show more/less)
   - Score summary

6. **MatchTable.tsx** - Group/league table display
   - Table header with group name
   - Team standings with position, played, goal difference, points
   - Team crests and indicators

7. **MatchLineups.tsx** - Team lineups display
   - Starting XI for both teams
   - Substitutes list
   - Formation information
   - Player cards with position colors
   - Position legend

8. **PlayerCard.tsx** - Individual player card
   - Player number badge with position-based color
   - Player name
   - Position badge
   - Hover effects

### Types

**types.ts** - Shared TypeScript interfaces
- `MatchEvent` - Match event data structure
- `Player` - Player information
- `Team` - Team data with players
- `MatchStatsData` - Match statistics structure
- `AdditionalStats` - Extended statistics
- `GroupTableRow` - Table row data
- `LineupData` - Lineup information with formations

### Utilities

**index.ts** - Barrel export file for easy imports

## Benefits of Refactoring

1. **Better Code Organization**
   - Each component has a single responsibility
   - Easier to locate and modify specific features

2. **Improved Maintainability**
   - Smaller components are easier to understand
   - Isolated changes reduce risk of bugs

3. **Enhanced Reusability**
   - Components can be used independently
   - PlayerCard, TabNavigation can be reused elsewhere

4. **Better Testing**
   - Smaller components are easier to test
   - Each component can be tested in isolation

5. **Improved Performance**
   - Using `useMemo` for expensive computations
   - Reduced re-renders with proper component separation

6. **Type Safety**
   - Dedicated types file with clear interfaces
   - Better IDE support and autocomplete

## Usage Example

```typescript
import LiveMatch from './components/sports/LiveMatch';

<LiveMatch
  homeTeam="Team A"
  awayTeam="Team B"
  homeScore={2}
  awayScore={1}
  homeCrest="/path/to/crest.png"
  awayCrest="/path/to/crest.png"
  currentMinute={75}
  isLive={true}
  statistics={apiStatistics}
  lineups={apiLineups}
  timeline={apiTimeline}
  // ... other props
/>
```

## File Size Reduction

- **Original**: LiveMatch.tsx - 2,368 lines
- **Refactored**: LiveMatch.tsx - 443 lines (81% reduction!)
- **Total new files**: 9 modular components

## Future Improvements

1. Add unit tests for each component
2. Add Storybook stories for component documentation
3. Consider extracting more shared utilities
4. Add error boundaries for graceful error handling
5. Implement skeleton loading states

