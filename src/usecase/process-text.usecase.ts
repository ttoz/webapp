import { Effect } from 'effect';
import { MastraService } from '../domain/mastra/service/mastra.service';

export class ProcessTextUseCase {
  constructor(private readonly mastraService: MastraService) {}

  execute(text: string): Effect.Effect<never, Error, string> {
    return Effect.gen(function* (_) {
      const result = yield* _(
        Effect.tryPromise(() => 
          Effect.runPromise(this.mastraService.processText(text))
        )
      );
      return result;
    });
  }
}