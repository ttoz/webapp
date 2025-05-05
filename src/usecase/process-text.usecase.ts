import { Effect } from 'effect';
import { MastraService } from '../domain/mastra/service/mastra.service';

export class ProcessTextUseCase {
  private readonly mastraService: MastraService
  constructor() {
    this.mastraService = new MastraService();
  }

  async execute(text: string): Promise<string> {
    const that = this;
    const program = Effect.gen(function* () {
      const str = yield* that.mastraService.processText(text);
      return str;
    });
    return await Effect.runPromise(program);
  }
}
