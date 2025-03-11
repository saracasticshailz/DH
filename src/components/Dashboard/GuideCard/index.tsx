import { Typography, CardContent } from '@mui/material';
import DownloadButton from '@/components/common/DownloadButton/DownloadButton';
import { StyledCard } from '@/components/common/StylesCard';
interface GuideCardProps {
  title: string;
  description: string;
  buttonText: string;
  onDownload?: () => void;
}

export default function GuideCard({ title, description, buttonText, onDownload }: GuideCardProps) {
  return (
    <StyledCard sx={{ mb: 3 }}>
      <CardContent>
        <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold' }}>
          {title}
        </Typography>
        <Typography color="text.secondary" sx={{ mb: 3 }}>
          {description}
        </Typography>
        <DownloadButton text={buttonText} onClick={onDownload} />
      </CardContent>
    </StyledCard>
  );
}
