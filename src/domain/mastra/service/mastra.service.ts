import { Effect } from 'effect';

export class MastraService {
  processText(text: string): Effect.Effect<never, Error, string> {
    if (!text) {
      return Effect.fail(new Error('テキストが空です'));
    }

    return Effect.succeed(`AI処理済み: ${text}`);
    // TODO: mastraによる実際のAI処理を実装
  }
}