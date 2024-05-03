import { CodeBlockWriter } from 'ts-morph';

export type ApiHandlerWriterOptions = {
  writer: CodeBlockWriter;
  method: string;
  handler: string;
  path: string;
  status: number;
  json?: string;
  query?: string;
  param?: string;
};

export const apiHandlerWriter = ({
  writer,
  method,
  path,
  handler,
  json,
  param,
  query,
  status,
}: ApiHandlerWriterOptions) => {
  writer.writeLine(`app.${method}(`);
  writer.quote(path);
  writer.write(',');
  writer.newLine();


  if (json) {
    writer.write(`zValidator(`);
    writer.quote('json');
    writer.write(`, ${json}),`);
    writer.newLine();
  }

  if (param) {
    writer.write(`zValidator(`);
    writer.quote('param');
    writer.write(`, ${param}),`);
    writer.newLine();
  }

  if (query) {
    writer.write(`zValidator(`);
    writer.quote('query');
    writer.write(`, ${query}),`);
    writer.newLine();
  }

  writer.write('async (c) =>');

  writer.inlineBlock(() => {
    if (json) {
      writer.write('const json = c.req.valid(');
      writer.quote('json');
      writer.write(');');
      writer.newLine();
    }

    if (param) {
      writer.write('const param = c.req.valid(');
      writer.quote('param');
      writer.write(');');
      writer.newLine();
    }

    if (query) {
      writer.write('const query = c.req.valid(');
      writer.quote('query');
      writer.write(');');
      writer.newLine();
    }

    writer.writeLine(`const result = await service.${handler};`);
    writer.write(`if (result.isErr()) `);
    writer.inlineBlock(() => {
      writer.writeLine('c.status(result.error.status as StatusCode);');
      writer.writeLine('return c.json(result.error);');
    });

    writer.writeLine(`c.status(${status});`);
    writer.writeLine('return c.json(result.value);');
  });

  writer.write(');');
};
