import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { useCoachConsole, useCoachConsoleLoading } from '@/context/CoachConsoleContext';
import { coachService, gymCoachService, programsService } from '@/services/api';
import type { Program } from '@/services/types';
import { AssignProgramModal } from './AssignProgramModal';
import { ProgramCard } from './ProgramCard';
import { ProgramAddCard } from './ProgramAddCard';

export function CoachProgramsPage() {
  const { user } = useAuth();
  const { features, basePath } = useCoachConsole();
  const navigate = useNavigate();
  const readOnly = !features.programLibrary;
  const [programs, setPrograms] = useState<Program[]>([]);
  const [coachPhotoUrl, setCoachPhotoUrl] = useState('');
  const [gymName, setGymName] = useState('');
  const [loading, setLoading] = useState(true);
  const [assignProgram, setAssignProgram] = useState<Program | null>(null);

  useCoachConsoleLoading(loading);

  async function reload() {
    const [programList, profile] = await Promise.all([
      programsService.list(),
      coachService.profile(),
    ]);
    setPrograms(programList);
    setCoachPhotoUrl(profile.photoUrl);
  }

  useEffect(() => {
    async function load() {
      try {
        await reload();
        if (readOnly) {
          setGymName(await gymCoachService.gymName());
        }
      } finally {
        setLoading(false);
      }
    }
    void load();
  }, [readOnly]);

  const brandingName = readOnly ? gymName || 'Gym program' : (user?.name ?? 'Coach');
  const brandingInitials = readOnly ? (gymName.slice(0, 2).toUpperCase() || 'GY') : (user?.initials ?? 'CT');

  return (
    <div className="ct-page ct-program-library">
      {readOnly && programs.length > 0 ? (
        <p style={{ fontSize: 13, color: 'var(--ct-text-muted)', marginBottom: 4, lineHeight: 1.45 }}>
          Monthly packages assigned by your gym. You cannot create or edit gym programs here.
        </p>
      ) : null}

      {programs.length === 0 && !loading ? (
        <p style={{ fontSize: 14, color: 'var(--ct-text-muted)' }}>
          {readOnly
            ? 'No programs assigned yet. Ask your gym admin to assign packages.'
            : 'No programs yet. Create your first template below.'}
        </p>
      ) : null}

      {programs.map((program) => (
        <ProgramCard
          key={program.id}
          program={program}
          coachName={readOnly ? `${brandingName} · Gym package` : brandingName}
          coachInitials={brandingInitials}
          coachPhotoUrl={readOnly ? undefined : coachPhotoUrl || undefined}
          readOnly={readOnly}
          onCoverChange={async (coverUrl) => {
            const updated = await programsService.updateCover(program.id, coverUrl);
            if (updated) {
              setPrograms((current) =>
                current.map((item) => (item.id === program.id ? updated : item)),
              );
            }
          }}
          onCoachPhotoChange={async (photoUrl) => {
            const profile = await coachService.updatePhoto(photoUrl);
            setCoachPhotoUrl(profile.photoUrl);
          }}
          onOpen={() => {
            if (!readOnly) navigate(`${basePath}/programs/${program.id}/edit`);
          }}
          onAssign={readOnly ? undefined : () => setAssignProgram(program)}
        />
      ))}

      {!readOnly ? <ProgramAddCard onClick={() => navigate(`${basePath}/programs/new`)} /> : null}

      <AssignProgramModal
        open={!!assignProgram}
        program={assignProgram}
        onClose={() => setAssignProgram(null)}
        onAssign={async (clientIds) => {
          if (!assignProgram) return;
          await programsService.assign(assignProgram.id, clientIds);
          await reload();
        }}
      />
    </div>
  );
}
