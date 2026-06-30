import { gymService } from '@/services/mock/gym';
import type { ProgramCreateInput } from '@/services/types';
import { ProgramBuilderPage } from '@/features/coach/programs/ProgramBuilderPage';

export function GymAdminProgramBuilder() {
  return (
    <ProgramBuilderPage
      backPath="/gym/admin/programs"
      loadProgram={async (id) => {
        const p = await gymService.getProgram(id);
        return p;
      }}
      onSave={async (input: ProgramCreateInput, id?: string) => {
        if (id) {
          await gymService.updateProgram(id, input);
        } else {
          await gymService.createProgram(input);
        }
      }}
    />
  );
}
