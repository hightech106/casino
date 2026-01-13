import React from 'react';
import { Box, Typography, Stack, Accordion, AccordionSummary, AccordionDetails } from '@mui/material';
import Iconify from 'src/components/iconify';
import { useLocales } from 'src/locales';

// ----------------------------------------------------------------------

export default function Fairness() {
  const { t } = useLocales();

  const fairnessItems = [
    {
      question: 'Game Fairness',
      answer: 'Random Number Generators (RNGs): • All our games use industry-standard Random Number Generators (RNGs) to ensure that all outcomes are completely random and unbiased. • Our RNGs are regularly tested and certified by independent third-party auditors to ensure compliance with industry standards.\n\nGame Testing and Certification: • We work with reputable testing agencies to certify that our games are fair and operate correctly. • Regular audits are conducted to maintain the integrity and fairness of our gaming systems.',
    },
    {
      question: 'Player Protection',
      answer: 'Responsible Gambling: • We promote responsible gambling and provide tools and resources to help players manage their gambling activities. • Players can set deposit limits, take breaks, or self-exclude from our platform if needed.\n\nData Protection: • We are committed to protecting the privacy and personal information of our players. • Our systems are secured with advanced encryption technologies to safeguard player data.',
    },
    {
      question: 'Transparency',
      answer: 'Clear Rules and Terms: • All game rules, terms, and conditions are clearly stated and easily accessible to players. • We ensure that players understand the rules before participating in any game.\n\nPayout Information: • Information about payouts, odds, and return-to-player (RTP) percentages is transparently provided for each game. • Players can access their transaction history and game logs at any time.',
    },
    {
      question: 'Dispute Resolution',
      answer: 'Customer Support: • Our customer support team is available to assist with any questions or concerns. • We are committed to resolving disputes fairly and promptly.',
    },
    {
      question: 'Compliance',
      answer: 'Licensing and Regulation: • LuckVerse777.com is licensed and regulated by the Government of the Autonomous Island of , Union of Comoros and operates under License No. L11543 /HM • We comply with all applicable laws and regulations to ensure a fair and legal gambling environment.\n\nContinuous Improvement: • We are committed to continuously improving our fairness measures and staying updated with industry best practices.',
    },
    {
      question: 'Conclusion',
      answer: 'At LuckVerse777.com, fairness is at the core of our operations. We strive to provide a trustworthy and enjoyable gaming experience for all our players. For any questions or further information about our fairness policy, please contact our customer support team.',
    },
  ];

  return (
    <Stack spacing={3}>
      <Typography
        variant="h3"
        sx={{
          color: '#24ee89',
          fontFamily: '"FONTSPRING DEMO - Blunt Con It", "Impact", sans-serif',
          fontWeight: '400 !important',
          fontStyle: 'italic !important',
          transform: 'skew(-5deg)',
          textTransform: 'uppercase',
          letterSpacing: '0.05em',
          mb: 2,
        }}
      >
        Fairness Policy
      </Typography>

      <Typography
        variant="h4"
        sx={{
          color: '#24ee89',
          fontFamily: '"FONTSPRING DEMO - Blunt Con It", "Impact", sans-serif',
          fontWeight: '400 !important',
          fontStyle: 'italic !important',
          transform: 'skew(-5deg)',
          textTransform: 'uppercase',
          letterSpacing: '0.05em',
          fontSize: '1.5rem',
          mb: 1,
        }}
      >
        Introduction
      </Typography>

      <Typography
        variant="body1"
        sx={{
          color: '#fff',
          fontFamily: '"Geogrotesque Cyr", sans-serif',
          fontWeight: '400',
          fontSize: 16,
          lineHeight: 1.6,
          mb: 3,
        }}
      >
        luckverse777.com is committed to providing a fair, transparent, and secure gambling environment for all our players. We adhere to the highest standards of integrity and fairness in all our games and operations. This policy outlines our commitment to fairness and the measures we take to ensure that all games are conducted honestly and transparently.
      </Typography>

      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' },
          gap: 2,
        }}
      >
        {fairnessItems.map((item, index) => (
          <Accordion
            key={index}
            sx={{
              bgcolor: '#2B2F3D',
              border: '1px solid #2B2F3D',
              borderRadius: '8px !important',
              '&:before': {
                display: 'none',
              },
              '&.Mui-expanded': {
                margin: 0,
                background: 'linear-gradient(180deg, rgba(255,231,26,0.2) 0%, rgba(255,231,26,0.05) 100%)',
                border: '1px solid #24ee89',
                '& .MuiAccordionSummary-expandIconWrapper': {
                  color: '#24ee89',
                },
                '& .MuiAccordionSummary-content .MuiTypography-root': {
                  color: '#24ee89',
                },
              },
            }}
          >
            <AccordionSummary
              expandIcon={<Iconify icon="eva:arrow-down-fill" sx={{ color: '#A0A3A7' }} />}
              sx={{
                '& .MuiAccordionSummary-content': {
                  margin: '12px 0',
                },
                '& .MuiAccordionSummary-expandIconWrapper': {
                  color: '#A0A3A7',
                  transition: 'color 0.3s ease',
                },
              }}
            >
              <Typography
                sx={{
                  color: '#fff',
                  fontFamily: '"Geogrotesque Cyr", sans-serif',
                  fontWeight: 600,
                  fontSize: 16,
                  transition: 'color 0.3s ease',
                }}
              >
                {item.question}
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography
                sx={{
                  color: '#A0A3A7',
                  fontFamily: '"Geogrotesque Cyr", sans-serif',
                  fontSize: 14,
                  lineHeight: 1.6,
                  whiteSpace: 'pre-line',
                }}
              >
                {item.answer}
              </Typography>
            </AccordionDetails>
          </Accordion>
        ))}
      </Box>
    </Stack>
  );
}