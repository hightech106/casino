import React from 'react';
import { Box, Typography, Stack, Accordion, AccordionSummary, AccordionDetails } from '@mui/material';
import Iconify from 'src/components/iconify';
import { useLocales } from 'src/locales';

// ----------------------------------------------------------------------

export default function SelfExclusion() {
  const { t } = useLocales();

  const selfExclusionItems = [
    {
      question: 'What is Self-Exclusion?',
      answer: 'Self-exclusion is a voluntary program that allows individuals to restrict their access to gambling services for a specified period. This tool is designed to help players manage their gambling behavior by providing a break from gambling activities.',
    },
    {
      question: 'How Self-Exclusion Works',
      answer: '1. Voluntary Participation:\n• Players can choose to self-exclude from our platform at any time.\n\n• The decision to self-exclude is entirely voluntary and can be initiated by the player through their account settings or by contacting customer liaison officer at compliance@luckverse777.com\n\n2. Duration of Self-Exclusion:\n• Players can select the duration of their self-exclusion period, which may range from a few days, month to several years, depending on their needs.\n\n• The decision to self-exclude is entirely voluntary and can be initiated by the player through their account settings or by contacting customer liaison officer at compliance@luckverse777.com\n\n3. Account Restrictions:\n• During the self-exclusion period, the player\'s account will be suspended, preventing access to gambling activities.\n\n• Players will not receive any promotional materials or communications related to gambling during this time.\n\n4. Reactivation Process:\n• After the self-exclusion period ends, players must contact the customer liaison officer at compliance@luckverse777.com to reactivate their account.\n\n• A cooling-off period may be applied before the account is fully reactivated to ensure the player is ready to return to gambling.',
    },
    {
      question: 'Support and Resources',
      answer: '1. Access to Support Services:\n• We provide information and links to professional support services and helplines for players seeking help with gambling-related issues.\n\n• Our customer support team is available to assist players in finding the resources they need.\n\n2. Encouragement to Seek Help:\n• Players who choose to self-exclude are encouraged to seek support from friends, family, or professional counseling services.\n\n• We offer guidance on how to access these resources and maintain a healthy approach to gambling.',
    },
    {
      question: 'Monitoring and Compliance',
      answer: '1. System Integration:\n• Our systems are designed to enforce self-exclusion effectively, ensuring that excluded players cannot access their accounts or create new ones.\n\n• We regularly review our self-exclusion processes to ensure compliance with industry standards and regulations.\n\n2. Collaboration with Regulatory Bodies:\n• We work closely with regulatory bodies to ensure our self-exclusion policies meet all legal requirements.\n\n• Our commitment to responsible gambling includes regular audits and updates to our self-exclusion procedures.',
    },
    {
      question: 'Conclusion',
      answer: 'Self-exclusion is an important tool for promoting responsible gambling and helping players manage their gambling activities. At luckverse777.com, we are committed to providing a safe and supportive environment for all our players. For more information about self-exclusion or to initiate the process, please contact our customer liaison officer at compliance@luckverse777.com',
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
        Self-Exclusion
      </Typography>

      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' },
          gap: 2,
        }}
      >
        {selfExclusionItems.map((item, index) => (
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