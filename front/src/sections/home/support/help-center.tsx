import React from 'react';
import { Box, Typography, Stack, Accordion, AccordionSummary, AccordionDetails } from '@mui/material';
import Iconify from 'src/components/iconify';
import { useLocales } from 'src/locales';

// ----------------------------------------------------------------------

export default function HelpCenter() {
  const { t } = useLocales();

  const faqItems = [
    {
      question: 'What should I do if I have forgotten my password?',
      answer: 'If you forgot your password you can get a new password immediately using the forgot password page. If you run into any issues our super friendly support staff will help you from 8:00am to 12:00pm in real time via chat - the orange icon at the bottom right of this page will open chat - or email at support@luckverse777.com',
    },
    {
      question: 'Are games fair?',
      answer: 'At LuckVerse777, we maintain fair play to the highest standards and deliver only the best games from leading and verified providers. Last but not least, all games have the necessary certificates - for random number generators and for RTP.',
    },
    {
      question: 'Can I play the casino games without spending any money?',
      answer: 'Yes, all players are able to practice or play their favourite games without the risk of losing real money. Just click "Play for Fun" to load the game in the demo play mode.',
    },
    {
      question: 'What happens if the game I\'m playing freezes in the middle of a round?',
      answer: 'If the game freezes while you are playing, your latest game round may stay unfinished. However, in such cases it is usually played on the server and the winnings, if any, are added to your balance.',
    },
    {
      question: 'I can\'t get the casino game to start when I click the link. What should I do?',
      answer: 'First, please check your Flash and Java software versions. To play any of the games, players must have the latest version of Java and Flash installed on their devices. Second, check your Internet connection because you might have lost it. Third, please clear your browser cache and cookies, restart the browser and try again. In case it still does not work, contact our Support Service Team. We will find a solution to any of such problems!',
    },
    {
      question: 'Is all my information secure on LuckVerse777?',
      answer: 'We use the best and most innovative technologies, 128 - bit Secure Socket Layer encryption and PGP protocol included, to ensure safe and secure data transfer.',
    },
    {
      question: 'How do I submit my documents? Where can I see the status of my documents?',
      answer: 'To upload the required documents, go to your personal profile and click on the \'Documents\' tab. Please mind that the file size should not exceed 2MB. Accepted file formats are pdf, gif, jpeg, jpg, bmp, png and tif. Once the documents are uploaded, please wait until we check them and verify your account. You can find out the status of your documents by clicking on the \'Documents\' tab like before.',
    },
    {
      question: 'Can I close my account for a specified amount of time?',
      answer: 'Sure. You are able to select a cool - off period or to self - exclude yourself for up to one year in your personal profile. You can also request our Support Service Team to close your account with a possibility to reopen it later. Just contact them directly through LiveChat or send an email to support@luckverse777.com They will sort everything out as fast as possible.',
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
        Help Center
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
        Find answers to frequently asked questions and get help with common issues.
      </Typography>

      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' },
          gap: 2,
        }}
      >
        {faqItems.map((item, index) => (
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