export type OptionValue = string | number;

export interface SelectProps<T extends OptionValue> {
  options: { label: string; value: T }[];
  value: T;
  onChange: (value: T) => void;
}
