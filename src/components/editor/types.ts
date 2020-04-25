export type EditorProps = {
  value: string;
  id: string;
  onRun?: () => any;
  onChange?: (val: string) => any;
};
