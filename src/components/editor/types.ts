export type EditorProps = {
  value: string;
  height: number;
  id: string;
  onRun?: () => any;
  onChange?: (val: string) => any;
};
