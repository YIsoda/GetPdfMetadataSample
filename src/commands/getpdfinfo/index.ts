import { Command, Flags } from '@oclif/core'
import { getDocument, PDFDocumentProxy } from 'pdfjs-dist';

export default class GetPdfInfoCommand extends Command {
  static description = 'Show specified PDF metadata';

  static examples = [
    `$ getpdfinfo <path_to_pdf_file>
`,
  ];

  static args = [{ name: 'file', description: 'PDF file to extract', required: true }]

  static flags = {
    title: Flags.boolean({
      char: "t",
      description: "show title only",
    })
  }

  async run(): Promise<void> {
    const { args, flags } = await this.parse(GetPdfInfoCommand);

    const path = args.file;
    const loadingTask = getDocument(path);
    loadingTask.promise.then(
      function (doc: PDFDocumentProxy) {
        const lastPromise = doc.getMetadata().then(
          function (data) {
            if (flags.title) {
              console.log((data.info as { Title: string }).Title);
              return;
            }
            console.log(data.info);
            const info = data.info;
            if ("subject" in info) {
              console.log(info.toString);
            }
            if (data.metadata) {
              console.log("## Metadata");
              console.log(data.metadata.getAll());
              console.log();
            }
          }
        )
      }
    );
  }
}
