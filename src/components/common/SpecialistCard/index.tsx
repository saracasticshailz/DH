import type React from 'react';
import { Box, CardContent, Typography, styled } from '@mui/material';
// import { Mail, Phone, User } from 'lucide-react';
import { IMG } from '@/assets/images';
import { StyledCard } from '../StylesCard';
import { Person } from '@mui/icons-material';

interface ContactCardProps {
  name: string;
  email: string;
  phone: string;
  title?: string;
}

const Card = styled(Box)(({ theme }) => ({
  backgroundColor: '#FFFFFF',
  borderRadius: '16px',
  padding: '24px',
  boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.05)',
  maxWidth: '400px',
  border: '1px solid #E5E7EB',
}));

const ContactItem = styled(Box)({
  display: 'flex',
  alignItems: 'center',
  gap: '12px',
  marginBottom: '12px',
  '&:last-child': {
    marginBottom: 0,
  },
});

const IconWrapper = styled(Box)({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  color: '#6B7280',
});

const ContactCard: React.FC<ContactCardProps> = ({ name, email, phone, title = 'Your Mortgage Specialist' }) => {
  return (
    <StyledCard sx={{ mb: 3 }}>
      <CardContent>
        <Typography
          variant="h6"
          sx={{
            fontSize: '18px',
            fontWeight: 600,
            color: '#111827',
            mb: 2,
          }}
        >
          {title}
        </Typography>

        <ContactItem>
          <IconWrapper>
            {/* <User size={20} /> */}
            <img src={IMG.UserIconcard} loading="lazy" height={20} width={20}/>
            {/* <Person /> */}
          </IconWrapper>

          <Typography
            sx={{
              color: '#4B5563',
              fontSize: '16px',
            }}
          >
            {name}
          </Typography>
        </ContactItem>

        <ContactItem>
          <IconWrapper>{/* <Mail size={20} /> */}
          <img src={IMG.EmailIcon} loading="lazy" height={20} width={20}/>
          </IconWrapper>
          <Typography
            sx={{
              color: '#4B5563',
              fontSize: '16px',
            }}
          >
            {email}
          </Typography>
        </ContactItem>

        <ContactItem>
          <IconWrapper>{/* <Phone size={20} /> */}
          <img src={IMG.PhoneIcon} loading="lazy" height={20} width={20}/>
          </IconWrapper>
          <Typography
            sx={{
              color: '#4B5563',
              fontSize: '16px',
            }}
          >
            {phone}
          </Typography>
        </ContactItem>
      </CardContent>
    </StyledCard>
  );
};

export default ContactCard;
