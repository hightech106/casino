// src/pages/user/missions.tsx
import { useEffect } from 'react';
import { useBoolean } from 'src/hooks/use-boolean';
import { useNavigate } from 'react-router-dom';
import { MissionModal } from 'src/sections/user/missions';

export default function MissionsPage() {
  const missionsModal = useBoolean(true);
  const navigate = useNavigate();

  const handleClose = () => {
    navigate(-1); 
    missionsModal.onFalse();
    
  };

  useEffect(() => {
    missionsModal.onTrue();
  }, [missionsModal]);

  return (
    <MissionModal open={missionsModal.value} onClose={handleClose} />
  );
}