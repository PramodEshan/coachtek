import { programsService } from '@/services/api';
import type { ProgramCreateInput } from '@/services/types';
import { ProgramBuilderPage } from './ProgramBuilderPage';

export function SoloCoachProgramBuilder() {
  return (
    <ProgramBuilderPage
      backPath="/solo-coach/programs"
      loadProgram={async (id) => {
        const p = await programsService.get(id);
        return p;
      }}
      onSave={async (input: ProgramCreateInput, id?: string) => {
        if (id) {
          await programsService.update(id, input);
        } else {
          await programsService.create(input);
        }
      }}
    />
  );
}
