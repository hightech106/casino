
import { Typography, Box } from '@mui/material';
import { useLocales } from 'src/locales';

const preventDefaultInteractions = (e: React.SyntheticEvent) => {
  e.preventDefault();
};

export default function RulesTab() {
  const { t } = useLocales();

  return (
    <Box
      sx={{
        pt: { xs: 0, sm: 1 },
        px: { xs: 1, sm: 3 },
        pb: { xs: 1, sm: 3 },
        backgroundColor: '#232626',
        userSelect: 'none',
        WebkitUserSelect: 'none',
        MozUserSelect: 'none',
        msUserSelect: 'none',
      }}
      onDragStart={preventDefaultInteractions}
      onTouchStart={preventDefaultInteractions}
      onTouchMove={preventDefaultInteractions}
    >
      <Typography
        variant="h5"
        sx={{
          color: '#E0E0E0',
          mb: 2,
          textAlign: 'left',
          fontWeight: '500',
          fontFamily: 'Impact, sans-serif',
          textTransform: 'uppercase',
          lineHeight: 'normal',
          textShadow: '0px 4.667px 4.667px rgba(0, 0, 0, 0.25)',
          pt: { xs: 2, sm: 0 },
          userSelect: 'none',
          WebkitUserSelect: 'none',
          MozUserSelect: 'none',
          msUserSelect: 'none',
          fontSize: { xs: 20, sm: 24, md: 22, lg: 26 },
        }}
      >
        GENERAL TERMS AND CONDITIONS
      </Typography>

      

     

      {/* Rules section */}
      <Box
        sx={{
          border: '1px solid #2B2F3D',
          borderRadius: '8px',
          p: 2,
          backgroundColor: '#232626',
          userSelect: 'none',
          WebkitUserSelect: 'none',
          MozUserSelect: 'none',
          msUserSelect: 'none',
        }}
      >
        <Typography
          variant="h6"
          sx={{
            mb: 1,
            fontFamily: 'FONTSPRING DEMO - Blunt Con It, Impact, sans-serif',
            textTransform: 'uppercase',
            lineHeight: 'normal',
            fontWeight: 400,
            fontStyle: 'italic',
            transform: 'skew(-5deg)',
            userSelect: 'none',
            WebkitUserSelect: 'none',
            MozUserSelect: 'none',
            msUserSelect: 'none',
            fontSize: { xs: 18, sm: 20, md: 19, lg: 22 },
          }}
        >
          <Box component="span" sx={{ color: '#24ee89' }}>SECTION 1:</Box>{' '}
          <Box component="span" sx={{ color: '#FFF' }}>ACCUMULATING POINTS</Box>
        </Typography>

        <Typography
          variant="body1"
          sx={{
            color: '#E0E0E0',
            mb: 1,
            fontFamily: 'Cera Pro, sans-serif',
            userSelect: 'none',
            WebkitUserSelect: 'none',
            MozUserSelect: 'none',
            msUserSelect: 'none',
            fontSize: { xs: 14, sm: 16, md: 15, lg: 16 },
          }}
        >
          Each customer can accumulate points by accessing the different categories in the menu of our loyalty program WINBET PLUS and fulfilling the rules defined for each of them:
        </Typography>

        <Box sx={{ pl: 2, mb: 1 }}>
          <Typography
            variant="body1"
            sx={{
              color: '#E0E0E0',
              fontFamily: 'Cera Pro, sans-serif',
              userSelect: 'none',
              WebkitUserSelect: 'none',
              MozUserSelect: 'none',
              msUserSelect: 'none',
              fontSize: { xs: 14, sm: 16, md: 15, lg: 16 },
            }}
          >
            • Missions
          </Typography>
          <Typography
            variant="body1"
            sx={{
              color: '#E0E0E0',
              fontFamily: 'Cera Pro, sans-serif',
              userSelect: 'none',
              WebkitUserSelect: 'none',
              MozUserSelect: 'none',
              msUserSelect: 'none',
              fontSize: { xs: 14, sm: 16, md: 15, lg: 16 },
            }}
          >
            • Tournaments
          </Typography>
          <Typography
            variant="body1"
            sx={{
              color: '#E0E0E0',
              fontFamily: 'Cera Pro, sans-serif',
              userSelect: 'none',
              WebkitUserSelect: 'none',
              MozUserSelect: 'none',
              msUserSelect: 'none',
              fontSize: { xs: 14, sm: 16, md: 15, lg: 16 },
            }}
          >
            • Badges
          </Typography>
          <Typography
            variant="body1"
            sx={{
              color: '#E0E0E0',
              fontFamily: 'Cera Pro, sans-serif',
              userSelect: 'none',
              WebkitUserSelect: 'none',
              MozUserSelect: 'none',
              msUserSelect: 'none',
              fontSize: { xs: 14, sm: 16, md: 15, lg: 16 },
            }}
          >
            • Mini games
          </Typography>
          <Typography
            variant="body1"
            sx={{
              color: '#E0E0E0',
              fontFamily: 'Cera Pro, sans-serif',
              userSelect: 'none',
              WebkitUserSelect: 'none',
              MozUserSelect: 'none',
              msUserSelect: 'none',
              fontSize: { xs: 14, sm: 16, md: 15, lg: 16 },
            }}
          >
            • Match Plus
          </Typography>
        </Box>

        <Typography
          variant="body1"
          sx={{
            color: '#E0E0E0',
            mb: 1,
            fontFamily: 'Cera Pro, sans-serif',
            userSelect: 'none',
            WebkitUserSelect: 'none',
            MozUserSelect: 'none',
            msUserSelect: 'none',
            fontSize: { xs: 14, sm: 16, md: 15, lg: 16 },
          }}
        >
          By placing bets with real funds, customers will accumulate points to reach higher levels. Each of the sections Casino, Live Casino, and Sports (incl. InPlay, eSports, and Virtuals) contribute differently to the points total. Bets of a total amount of 100 BGN (or the equivalent in euro) placed with real funds in the Casino or Live Casino sections provide customers with 1 point.
        </Typography>

        <Typography
          variant="body2"
          sx={{
            color: '#E0E0E0',
            mb: 1,
            fontStyle: 'italic',
            fontFamily: 'Cera Pro, sans-serif',
            userSelect: 'none',
            WebkitUserSelect: 'none',
            MozUserSelect: 'none',
            msUserSelect: 'none',
            fontSize: { xs: 12, sm: 14, md: 13, lg: 14 },
          }}
        >
          *Bets placed on the tables from the Svara sections will not contribute for points accumulation.
        </Typography>

        <Typography
          variant="body2"
          sx={{
            color: '#E0E0E0',
            mb: 1,
            fontStyle: 'italic',
            fontFamily: 'Cera Pro, sans-serif',
            userSelect: 'none',
            WebkitUserSelect: 'none',
            MozUserSelect: 'none',
            msUserSelect: 'none',
            fontSize: { xs: 12, sm: 14, md: 13, lg: 14 },
          }}
        >
          *Bets placed on the following games/tables in the sections Casino and Live Casino will not contribute to the accumulation of points: all tables of the 7 Mojos provider in the section Live Casino, all roulette tables of the provider Amusnet Interactive in the sections Casino/Live Casino, all tables from the type First Person in the Live Casino section, all tables from the type Baccarat, 3 Card Brag, 4 of a Kind Bonus Poker, Aces and Faces (Multi-Hand), American Roulette, Blackjack 3 Hand, Blackjack Cashback, Blackjack Double Exposure 3 Hand, Blackjack Surrender Multihand 5, Blackjack Touch - Single Deck, Booster Roulette, Buster Blackjack, Caribbean HoldEm, Caribbean Poker, Caribbean Poker Royal Flush Jackpot, Casino Holdem (NetEnt), Casino Hold Em (Playtech), Casino War, Classic Roulette, Deuces Wild (Multi-Hand), Dice 2, Dice 5, Dragon Tiger, European Roulette (NetEnt), European Roulette (Habanero), First Person Dragon Tiger, Frankie Dettori Magic 7 Blackjack / SEVEN STARS, Free Chip Blackjack, Heads Up Hold`Em, I Luv Suits Poker, Jacks or Better, Jacks or Better Double Up, Jacks or Better Multi-Hand, Joker Poker, Lucky Lucky Blackjack, Mega Fire Blaze Roulette, Mini Roulette, Mobile Blackjack, Premium Blackjack, Premium European Roulette, Roulette 7, Roulette Advanced, Roulette European, Three Card Poker, Vegas Blackjack!, Andar Bahar, Bac Bo, Buffalo Blitz Live Slots, Craps, Dragon Tiger, Dream Catcher, Hi-Lo, Lightning Dice, Monopoly Big Baller, Sette E Mezzo, Spin a Win, Teen Patti, and Teen Patti Face Off.
        </Typography>

        <Typography
          variant="body1"
          sx={{
            color: '#E0E0E0',
            mb: 1,
            fontFamily: 'Cera Pro, sans-serif',
            userSelect: 'none',
            WebkitUserSelect: 'none',
            MozUserSelect: 'none',
            msUserSelect: 'none',
            fontSize: { xs: 14, sm: 16, md: 15, lg: 16 },
          }}
        >
          Bets of a total amount of 30 BGN (or the equivalent in euro), placed with real funds in the Sports section (incl. InPlay, eSports, and Virtuals), provide customers with 1 point.
        </Typography>

        <Typography
          variant="body2"
          sx={{
            color: '#E0E0E0',
            mb: 1,
            fontStyle: 'italic',
            fontFamily: 'Cera Pro, sans-serif',
            userSelect: 'none',
            WebkitUserSelect: 'none',
            MozUserSelect: 'none',
            msUserSelect: 'none',
            fontSize: { xs: 12, sm: 14, md: 13, lg: 14 },
          }}
        >
          *Only won and lost bets will contribute to the accumulation of points in the Sports section (incl. InPlay, eSports, and Virtuals).
        </Typography>

        <Typography
          variant="body2"
          sx={{
            color: '#E0E0E0',
            mb: 1,
            fontStyle: 'italic',
            fontFamily: 'Cera Pro, sans-serif',
            userSelect: 'none',
            WebkitUserSelect: 'none',
            MozUserSelect: 'none',
            msUserSelect: 'none',
            fontSize: { xs: 12, sm: 14, md: 13, lg: 14 },
          }}
        >
          *Bets for which the Cash Out function has been used will not contribute to the accumulation of points.
        </Typography>

        <Typography
          variant="body2"
          sx={{
            color: '#E0E0E0',
            mb: 1,
            fontStyle: 'italic',
            fontFamily: 'Cera Pro, sans-serif',
            userSelect: 'none',
            WebkitUserSelect: 'none',
            MozUserSelect: 'none',
            msUserSelect: 'none',
            fontSize: { xs: 12, sm: 14, md: 13, lg: 14 },
          }}
        >
          *We set certain wagering conditions to prevent abuse by participating customers and ensure fair play. The first one is the restriction on placing bets on more than 24 roulette numbers (66% of the roulette coverage). Each customer should ensure that their bets cover 24 or fewer numbers. Otherwise, they will not be considered for points accumulation. The second restriction is against betting red and black at the same time on roulette, as well as all other equal bets. We set these limits in order to maintain fair play and keep the level of abuse to a minimum.
        </Typography>

        <Typography
          variant="body1"
          sx={{
            color: '#E0E0E0',
            mb: 1,
            fontFamily: 'Cera Pro, sans-serif',
            userSelect: 'none',
            WebkitUserSelect: 'none',
            MozUserSelect: 'none',
            msUserSelect: 'none',
            fontSize: { xs: 14, sm: 16, md: 15, lg: 16 },
          }}
        >
          Accumulated points can be used in the various categories to purchase additional functionalities such as spinning a wheel, purchasing additional bonuses from a store, etc.
        </Typography>

        <Box sx={{ borderBottom: '1px solid #2B2F3D', my: 2 }} />

        {/* Missions section */}
        <Typography
          variant="h6"
          sx={{
            mb: 1,
            fontFamily: 'FONTSPRING DEMO - Blunt Con It, Impact, sans-serif',
            textTransform: 'uppercase',
            lineHeight: 'normal',
            fontWeight: 400,
            fontStyle: 'italic',
            transform: 'skew(-5deg)',
            userSelect: 'none',
            WebkitUserSelect: 'none',
            MozUserSelect: 'none',
            msUserSelect: 'none',
            fontSize: { xs: 18, sm: 20, md: 19, lg: 22 },
          }}
        >
          <Box component="span" sx={{ color: '#24ee89' }}>SECTION 2:</Box>{' '}
          <Box component="span" sx={{ color: '#FFF' }}>MISSIONS</Box>
        </Typography>

        <Typography
          variant="body1"
          sx={{
            color: '#E0E0E0',
            mb: 1,
            fontFamily: 'Cera Pro, sans-serif',
            userSelect: 'none',
            WebkitUserSelect: 'none',
            MozUserSelect: 'none',
            msUserSelect: 'none',
            fontSize: { xs: 14, sm: 16, md: 15, lg: 16 },
          }}
        >
          By fulfilling the conditions of each mission, customers will accumulate additional points to reach higher levels. The missions require activation by pressing the Opt-in button. If the client has not pressed the Opt-in button, he will not be able to receive the specific reward, even if the conditions required by the respective mission have been met.
        </Typography>

        <Typography
          variant="body2"
          sx={{
            color: '#E0E0E0',
            mb: 1,
            fontStyle: 'italic',
            fontFamily: 'Cera Pro, sans-serif',
            userSelect: 'none',
            WebkitUserSelect: 'none',
            MozUserSelect: 'none',
            msUserSelect: 'none',
            fontSize: { xs: 12, sm: 14, md: 13, lg: 14 },
          }}
        >
          *If the condition for completing a specific mission by the Organizer is bets to be placed in the Live Casino section, the bets placed on all Amusnet Interactive and 7 Mojos tables will not contribute to the completion of a specific mission.
        </Typography>

        <Typography
          variant="body2"
          sx={{
            color: '#E0E0E0',
            mb: 1,
            fontStyle: 'italic',
            fontFamily: 'Cera Pro, sans-serif',
            userSelect: 'none',
            WebkitUserSelect: 'none',
            MozUserSelect: 'none',
            msUserSelect: 'none',
            fontSize: { xs: 12, sm: 14, md: 13, lg: 14 },
          }}
        >
          *Except in cases where a specific provider mass is not additionally stated as qualifying for mission execution.
        </Typography>

        <Typography
          variant="body2"
          sx={{
            color: '#E0E0E0',
            mb: 1,
            fontStyle: 'italic',
            fontFamily: 'Cera Pro, sans-serif',
            userSelect: 'none',
            WebkitUserSelect: 'none',
            MozUserSelect: 'none',
            msUserSelect: 'none',
            fontSize: { xs: 12, sm: 14, md: 13, lg: 14 },
          }}
        >
          *We set certain wagering conditions to prevent abuse by participating customers and ensure fair play. The first one is the restriction on placing bets on more than 24 roulette numbers (66% of the roulette coverage). Each customer should ensure that their bets cover 24 or fewer numbers. Otherwise, they will not be considered as contributing to the completion of the respective mission. The second restriction is against betting red and black at the same time on roulette, as well as all other equal bets. We set these limits in order to maintain fair play and keep the level of abuse to a minimum.
        </Typography>

        <Typography
          variant="body2"
          sx={{
            color: '#E0E0E0',
            mb: 1,
            fontStyle: 'italic',
            fontFamily: 'Cera Pro, sans-serif',
            userSelect: 'none',
            WebkitUserSelect: 'none',
            MozUserSelect: 'none',
            msUserSelect: 'none',
            fontSize: { xs: 12, sm: 14, md: 13, lg: 14 },
          }}
        >
          *Only won and lost bets will contribute to the accumulation of points in the Sports section (incl. InPlay, eSports, and Virtuals). Bets made on the same market are not taken into account when accumulating points and do not affect progress towards completing missions.
        </Typography>

        <Typography
          variant="body2"
          sx={{
            color: '#E0E0E0',
            mb: 1,
            fontStyle: 'italic',
            fontFamily: 'Cera Pro, sans-serif',
            userSelect: 'none',
            WebkitUserSelect: 'none',
            MozUserSelect: 'none',
            msUserSelect: 'none',
            fontSize: { xs: 12, sm: 14, md: 13, lg: 14 },
          }}
        >
          *If the condition for completing a specific mission by the Organizer requires a specific total value of profits for its implementation (e.g. 500 BGN) or count of winnings, only the clients earned net profits will contribute to the implementation of the specific mission.
        </Typography>

        <Box sx={{ borderBottom: '1px solid #2B2F3D', my: 2 }} />

        {/* Levels section */}
        <Typography
          variant="h6"
          sx={{
            mb: 1,
            fontFamily: 'FONTSPRING DEMO - Blunt Con It, Impact, sans-serif',
            textTransform: 'uppercase',
            lineHeight: 'normal',
            fontWeight: 400,
            fontStyle: 'italic',
            transform: 'skew(-5deg)',
            userSelect: 'none',
            WebkitUserSelect: 'none',
            MozUserSelect: 'none',
            msUserSelect: 'none',
            fontSize: { xs: 18, sm: 20, md: 19, lg: 22 },
          }}
        >
          <Box component="span" sx={{ color: '#24ee89' }}>SECTION 3:</Box>{' '}
          <Box component="span" sx={{ color: '#FFF' }}>LEVELS</Box>
        </Typography>

        <Typography
          variant="body1"
          sx={{
            color: '#E0E0E0',
            mb: 1,
            fontFamily: 'Cera Pro, sans-serif',
            userSelect: 'none',
            WebkitUserSelect: 'none',
            MozUserSelect: 'none',
            msUserSelect: 'none',
            fontSize: { xs: 14, sm: 16, md: 15, lg: 16 },
          }}
        >
          In the Levels category, all reached levels are visualized, as well as upcoming ones. By collecting points, each customer reaches a higher level, which can unlock hidden missions, tournaments, or items from the Shop category. Accumulated points can be spent without affecting progress towards leveling up.
        </Typography>

        <Box sx={{ borderBottom: '1px solid #2B2F3D', my: 2 }} />

        {/* Badges section */}
        <Typography
          variant="h6"
          sx={{
            mb: 1,
            fontFamily: 'FONTSPRING DEMO - Blunt Con It, Impact, sans-serif',
            textTransform: 'uppercase',
            lineHeight: 'normal',
            fontWeight: 400,
            fontStyle: 'italic',
            transform: 'skew(-5deg)',
            userSelect: 'none',
            WebkitUserSelect: 'none',
            MozUserSelect: 'none',
            msUserSelect: 'none',
            fontSize: { xs: 18, sm: 20, md: 19, lg: 22 },
          }}
        >
          <Box component="span" sx={{ color: '#24ee89' }}>SECTION 4:</Box>{' '}
          <Box component="span" sx={{ color: '#FFF' }}>BADGES</Box>
        </Typography>

        <Typography
          variant="body1"
          sx={{
            color: '#E0E0E0',
            mb: 1,
            fontFamily: 'Cera Pro, sans-serif',
            userSelect: 'none',
            WebkitUserSelect: 'none',
            MozUserSelect: 'none',
            msUserSelect: 'none',
            fontSize: { xs: 14, sm: 16, md: 15, lg: 16 },
          }}
        >
          Every 5 levels reached will unlock a badge. Previously, badges would only be rendered with their frame. After reaching the respective level, the overall picture of the badge will be visualized, and each customer will receive a reward in the form of points contributing to their reaching higher levels.
        </Typography>

        <Box sx={{ borderBottom: '1px solid #2B2F3D', my: 2 }} />

        {/* Mini games section */}
        <Typography
          variant="h6"
          sx={{
            mb: 1,
            fontFamily: 'FONTSPRING DEMO - Blunt Con It, Impact, sans-serif',
            textTransform: 'uppercase',
            lineHeight: 'normal',
            fontWeight: 400,
            fontStyle: 'italic',
            transform: 'skew(-5deg)',
            userSelect: 'none',
            WebkitUserSelect: 'none',
            MozUserSelect: 'none',
            msUserSelect: 'none',
            fontSize: { xs: 18, sm: 20, md: 19, lg: 22 },
          }}
        >
          <Box component="span" sx={{ color: '#24ee89' }}>SECTION 5:</Box>{' '}
          <Box component="span" sx={{ color: '#FFF' }}>MINI GAMES</Box>
        </Typography>

        <Typography
          variant="body1"
          sx={{
            color: '#E0E0E0',
            mb: 1,
            fontFamily: 'Cera Pro, sans-serif',
            userSelect: 'none',
            WebkitUserSelect: 'none',
            MozUserSelect: 'none',
            msUserSelect: 'none',
            fontSize: { xs: 14, sm: 16, md: 15, lg: 16 },
          }}
        >
          In the Mini games category, customers will be able to find different types of wheels and scratch cards. Each wheel or scratch card has a price that can be paid with the points collected in the profile (if a purchase is required). After payment (if it is required), the selected wheel can be spun, and different types of prizes or points can be won. Apart from spinning a wheel, customers will also be able to choose the option to scratch a scratch card which can earn them different types of bonus rewards or points. After reaching each 5 levels, the customers will receive as a gift from The Organizer a bonus with no deposit required.
        </Typography>

        <Box sx={{ borderBottom: '1px solid #2B2F3D', my: 2 }} />

        {/* Store section */}
        <Typography
          variant="h6"
          sx={{
            mb: 1,
            fontFamily: 'FONTSPRING DEMO - Blunt Con It, Impact, sans-serif',
            textTransform: 'uppercase',
            lineHeight: 'normal',
            fontWeight: 400,
            fontStyle: 'italic',
            transform: 'skew(-5deg)',
            userSelect: 'none',
            WebkitUserSelect: 'none',
            MozUserSelect: 'none',
            msUserSelect: 'none',
            fontSize: { xs: 18, sm: 20, md: 19, lg: 22 },
          }}
        >
          <Box component="span" sx={{ color: '#24ee89' }}>SECTION 6:</Box>{' '}
          <Box component="span" sx={{ color: '#FFF' }}>STORE</Box>
        </Typography>

        

        <Box sx={{ pl: 2, mb: 1 }}>
          <Typography
            variant="body1"
            sx={{
              color: '#E0E0E0',
              fontFamily: 'Cera Pro, sans-serif',
              userSelect: 'none',
              WebkitUserSelect: 'none',
              MozUserSelect: 'none',
              msUserSelect: 'none',
              fontSize: { xs: 14, sm: 16, md: 15, lg: 16 },
            }}
          >
            • Cash bonus with No deposit
          </Typography>
          <Typography
            variant="body1"
            sx={{
              color: '#E0E0E0',
              fontFamily: 'Cera Pro, sans-serif',
              userSelect: 'none',
              WebkitUserSelect: 'none',
              MozUserSelect: 'none',
              msUserSelect: 'none',
              fontSize: { xs: 14, sm: 16, md: 15, lg: 16 },
            }}
          >
            • Free bets with No deposit for the Live Casino and Sport sections
          </Typography>
          <Typography
            variant="body1"
            sx={{
              color: '#E0E0E0',
              fontFamily: 'Cera Pro, sans-serif',
              userSelect: 'none',
              WebkitUserSelect: 'none',
              MozUserSelect: 'none',
              msUserSelect: 'none',
              fontSize: { xs: 14, sm: 16, md: 15, lg: 16 },
            }}
          >
            • Free spins with No deposit for the Casino section
          </Typography>
          <Typography
            variant="body1"
            sx={{
              color: '#E0E0E0',
              fontFamily: 'Cera Pro, sans-serif',
              userSelect: 'none',
              WebkitUserSelect: 'none',
              MozUserSelect: 'none',
              msUserSelect: 'none',
              fontSize: { xs: 14, sm: 16, md: 15, lg: 16 },
            }}
          >
            • Subject prizes
          </Typography>
        </Box>

        <Typography
          variant="body1"
          sx={{
            color: '#E0E0E0',
            mb: 1,
            fontFamily: 'Cera Pro, sans-serif',
            userSelect: 'none',
            WebkitUserSelect: 'none',
            MozUserSelect: 'none',
            msUserSelect: 'none',
            fontSize: { xs: 14, sm: 16, md: 15, lg: 16 },
          }}
        >
          Each bonus has a cost displayed as points and can be purchased through them.
        </Typography>

        <Typography
          variant="body2"
          sx={{
            color: '#E0E0E0',
            mb: 1,
            fontStyle: 'italic',
            fontFamily: 'Cera Pro, sans-serif',
            userSelect: 'none',
            WebkitUserSelect: 'none',
            MozUserSelect: 'none',
            msUserSelect: 'none',
            fontSize: { xs: 12, sm: 14, md: 13, lg: 14 },
          }}
        >
          *The total number of points that customers accumulate can be spent (e.g., Store category), but this does not affect the remaining number of points to reach the next level. Points remaining until reaching the next level do not change.
        </Typography>

        <Box sx={{ borderBottom: '1px solid #2B2F3D', my: 2 }} />

        {/* Inbox section */}
        <Typography
          variant="h6"
          sx={{
            mb: 1,
            fontFamily: 'FONTSPRING DEMO - Blunt Con It, Impact, sans-serif',
            textTransform: 'uppercase',
            lineHeight: 'normal',
            fontWeight: 400,
            fontStyle: 'italic',
            transform: 'skew(-5deg)',
            userSelect: 'none',
            WebkitUserSelect: 'none',
            MozUserSelect: 'none',
            msUserSelect: 'none',
            fontSize: { xs: 18, sm: 20, md: 19, lg: 22 },
          }}
        >
          <Box component="span" sx={{ color: '#24ee89' }}>SECTION 7:</Box>{' '}
          <Box component="span" sx={{ color: '#FFF' }}>INBOX</Box>
        </Typography>

        <Typography
          variant="body1"
          sx={{
            color: '#E0E0E0',
            mb: 1,
            fontFamily: 'Cera Pro, sans-serif',
            userSelect: 'none',
            WebkitUserSelect: 'none',
            MozUserSelect: 'none',
            msUserSelect: 'none',
            fontSize: { xs: 14, sm: 16, md: 15, lg: 16 },
          }}
        >
          In the Inbox category, all current messages related to upcoming offers, news, and bonuses will be visible in the relevant customer profile.
        </Typography>
      </Box>

      {/* Footer note */}
      <Typography
        variant="body2"
        sx={{
          color: '#E0E0E0',
          mt: 2,
          fontStyle: 'italic',
          fontFamily: 'Cera Pro, sans-serif',
          userSelect: 'none',
          WebkitUserSelect: 'none',
          MozUserSelect: 'none',
          msUserSelect: 'none',
          fontSize: { xs: 12, sm: 14, md: 13, lg: 14 },
        }}
      >
        *Bets placed in the Sports section are used to unlock additional points.
      </Typography>
    </Box>
  );
}