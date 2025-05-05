import { Effect } from 'effect';
import { MastraService } from '../domain/mastra/service/mastra.service';

export class ProcessTextUseCase {
  constructor(private readonly mastraService: MastraService) {}

  execute(text: string):string {
    const that = this;
    const program = Effect.gen(function* () {
      const str = yield* that.mastraService.processText(text);
      return str;
    });
    return Effect.runSync(program);
  }
}
