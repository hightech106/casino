import React from 'react';
import { Box, Typography, Stack, Accordion, AccordionSummary, AccordionDetails } from '@mui/material';
import Iconify from 'src/components/iconify';
import { useLocales } from 'src/locales';

// ----------------------------------------------------------------------

export default function ResponsibleGambling() {
  const { t } = useLocales();

  const responsibleGamblingItems = [
    {
      question: 'Responsible Gambling',
      answer: 'To help prevent gambling addiction and address any related issues, we provide you with the following information:\n\nGambling involves a risk of addiction, so we encourage you to play wisely and responsibly. We advise you to view gambling as a form of entertainment, not as a solution to financial or social challenges. If you notice signs of problematic gambling behavior, such as betting large amounts you cannot afford or feeling a constant, uncontrollable urge to gamble, you can use the following options:\n\n• Limit access to your gaming account through your profile settings.\n\n• Set deposit and/or loss limits.\n\n• Restrict access to certain gaming sections of the website.\n\nYou can manage these options directly in your account settings or contact our support team for assistance via email at: support@luckverse777.com.',
    },
    {
      question: 'Counseling and Therapy Options for Gambling Addiction',
      answer: 'If you or someone you know is struggling with gambling addiction, there are various professional options available for counseling and therapy. Seeking help is an important step in addressing gambling-related issues. You can explore the following resources:\n\n• Professional Counseling: Reach out to certified therapists who specialize in treating gambling addiction.\n\n• Support Groups: Join groups like Gamblers Anonymous (gamblersanonymous.org), where individuals with similar experiences share support and advice.\n\n• Online Resources: Access self-help programs and materials from organizations like BeGambleAware (begambleaware.org) or Gambling Therapy (gamblingtherapy.org), which provide free support for those affected by problem gambling.\n\n• Helplines: Contact gambling addiction helplines, such as 1-800-GAMBLER in the U.S. or the National Gambling Helpline in the UK (0808 8020 133), for immediate support and guidance.',
    },
    {
      question: 'Minors and Gambling',
      answer: 'Registering an account and placing bets on luckverse777.com is strictly allowed only for individuals who are 18 years or older. At luckverse777.com, we take the verification of players\' age very seriously. We may request additional information to confirm your age and restrict access to your account until your age has been verified.\n\nWe are fully committed to this responsibility and apply strict measures to ensure compliance with these regulations!',
    },
    {
      question: 'Financial Limits: Daily, Weekly, and Monthly',
      answer: 'At luckverse777.com, we encourage responsible gambling by offering a variety of financial limits to help you manage your gameplay. You can set daily, weekly, or monthly limits on your account to control your spending and ensure that gambling remains fun and within your budget.\n\nTypes of Limits:\n• Daily Limits: Set a maximum amount you can deposit or lose in a single day.\n\n• Weekly Limits: Manage your spending across a full week by setting a limit on deposits or losses.\n\n• Monthly Limits: Ensure long-term control by establishing a monthly cap on deposits or losses.\n\nYou can adjust these limits at any time through your account settings. If you need assistance in setting or adjusting your limits, feel free to contact our support team.',
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
        Responsible Gambling
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
        We are committed to promoting responsible gambling and providing a safe gaming environment for all our players.
      </Typography>

      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' },
          gap: 2,
        }}
      >
        {responsibleGamblingItems.map((item, index) => (
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