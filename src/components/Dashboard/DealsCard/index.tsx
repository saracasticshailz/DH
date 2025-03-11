import { Box, Typography, CardContent, Button, colors } from '@mui/material';
import { DealsHeader, DealItem } from './styles';
import { StyledCard } from '@/components/common/StylesCard';
import { COLORS, PALETTE_COLORS } from '@/theme/colors';
interface Deal {
  id: string;
  image: string;
  title: string;
  description: string;
}

interface DealsCardProps {
  title: string;
  description: string;
  viewAllText: string;
  deals: Deal[];
  onViewAll?: () => void;
}

export default function DealsCard({ title, description, viewAllText, deals, onViewAll }: DealsCardProps) {
  return (
    <StyledCard>
      <CardContent>
        <DealsHeader>
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            {title}
          </Typography>
          <Button sx={{ color: COLORS.RED_PRIMARY }} onClick={onViewAll}>
            {viewAllText}
          </Button>
        </DealsHeader>
        <Typography color="text.secondary" sx={{ mb: 3 }}>
          {description}
        </Typography>

        {deals.map((deal) => (
          <DealItem key={deal.id}>
            <img src={deal.image || '/placeholder.svg'} alt={deal.title} />
            <Box>
              <Typography variant="subtitle1" sx={{ fontWeight: 500 }}>
                {deal.title}
              </Typography>
              <Typography color="text.secondary">{deal.description}</Typography>
            </Box>
          </DealItem>
        ))}
      </CardContent>
    </StyledCard>
  );
}
