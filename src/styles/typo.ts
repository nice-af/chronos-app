import { TextStyle } from 'react-native';

const headline: TextStyle = {
  fontSize: 14,
  lineHeight: 16,
  fontWeight: '600',
  letterSpacing: 0.35,
};

const headlineEmphasized: TextStyle = {
  ...headline,
  fontWeight: '800',
};

const callout: TextStyle = {
  fontSize: 12,
  lineHeight: 15,
  fontWeight: '400',
};

const calloutEmphasized: TextStyle = {
  ...callout,
  fontWeight: '600',
};

const subheadline: TextStyle = {
  fontSize: 11,
  lineHeight: 14,
  fontWeight: '400',
};

const subheadlineEmphasized: TextStyle = {
  ...subheadline,
  fontWeight: '600',
};

const footnote: TextStyle = {
  fontSize: 10,
  lineHeight: 13,
  fontWeight: '400',
};

const footnoteEmphasized: TextStyle = {
  ...footnote,
  fontWeight: '600',
};

export const typo = {
  headline,
  headlineEmphasized,
  callout,
  calloutEmphasized,
  subheadline,
  subheadlineEmphasized,
  footnote,
  footnoteEmphasized,
};
