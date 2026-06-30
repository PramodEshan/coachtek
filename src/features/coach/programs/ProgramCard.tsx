import { useRef, type ChangeEvent } from 'react';
import { Avatar } from '@/components/ui';
import type { Program } from '@/services/types';

function readImageFile(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(new Error('Could not read image'));
    reader.readAsDataURL(file);
  });
}

interface ProgramCardProps {
  program: Program;
  coachName: string;
  coachInitials: string;
  coachPhotoUrl?: string;
  readOnly?: boolean;
  onCoverChange: (coverUrl: string) => void;
  onCoachPhotoChange: (photoUrl: string) => void;
  onOpen?: () => void;
  onAssign?: () => void;
}

export function ProgramCard({
  program,
  coachName,
  coachInitials,
  coachPhotoUrl,
  readOnly = false,
  onCoverChange,
  onCoachPhotoChange,
  onOpen,
  onAssign,
}: ProgramCardProps) {
  const coverInputRef = useRef<HTMLInputElement>(null);
  const coachInputRef = useRef<HTMLInputElement>(null);

  async function handleCoverPick(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    event.target.value = '';
    if (!file?.type.startsWith('image/')) return;
    onCoverChange(await readImageFile(file));
  }

  async function handleCoachPhotoPick(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    event.target.value = '';
    if (!file?.type.startsWith('image/')) return;
    onCoachPhotoChange(await readImageFile(file));
  }

  return (
    <article className="ct-program-card">
      <div className="ct-program-card-media">
        {program.coverUrl ? (
          <img src={program.coverUrl} alt="" className="ct-program-card-cover" />
        ) : (
          <div className="ct-program-card-cover ct-program-card-cover-empty" />
        )}
        <span className="ct-program-card-badge">{program.tag.toUpperCase()}</span>
        {!readOnly ? (
          <>
            <button
              type="button"
              className="ct-program-card-media-btn ct-press"
              onClick={() => coverInputRef.current?.click()}
            >
              {program.coverUrl ? 'Change photo' : 'Add photo'}
            </button>
            <input
              ref={coverInputRef}
              type="file"
              accept="image/*"
              hidden
              onChange={handleCoverPick}
            />
          </>
        ) : null}
      </div>

      <div className="ct-program-card-body">
        <div className="ct-program-card-headline">
          <h3 className="ct-program-card-title">{program.name}</h3>
          <span className="ct-program-card-meta">
            {program.weeks} wks · {program.days}d/wk · {program.price} {program.priceLabel}
          </span>
        </div>

        <div className="ct-program-card-coach">
          {readOnly ? (
            <>
              <Avatar initials={coachInitials} tint="sage" size={26} shape="round" alt={coachName} />
              <span className="ct-program-card-coach-name">{coachName}</span>
            </>
          ) : (
            <>
              <button
                type="button"
                className="ct-program-card-coach-avatar ct-press"
                onClick={() => coachInputRef.current?.click()}
                title="Upload coach photo"
              >
                <Avatar
                  initials={coachInitials}
                  tint="sage"
                  size={26}
                  shape="round"
                  src={coachPhotoUrl}
                  alt={coachName}
                />
                <span className="ct-program-card-coach-camera" aria-hidden>
                  +
                </span>
              </button>
              <span className="ct-program-card-coach-name">{coachName}</span>
              <input
                ref={coachInputRef}
                type="file"
                accept="image/*"
                hidden
                onChange={handleCoachPhotoPick}
              />
            </>
          )}
        </div>

        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          <button type="button" className="ct-program-card-action ct-press" onClick={onOpen}>
            Open program
          </button>
          {!readOnly && onAssign ? (
            <button type="button" className="ct-btn-secondary ct-press" style={{ fontSize: 13 }} onClick={onAssign}>
              Assign
            </button>
          ) : null}
        </div>
      </div>
    </article>
  );
}
