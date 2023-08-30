import React from 'react';
import ContentLoader, { Rect } from 'react-content-loader/native';

type Props = {
  backgroundColor: string;
  foregroundColor: string;
};

const WorkoutPromiseLoader = (props: Props) => (
  <ContentLoader
    speed={2}
    width={400}
    height={1000}
    viewBox="0 0 400 1000"
    backgroundColor={props.backgroundColor}
    foregroundColor={props.foregroundColor}>
    <Rect x="20" y="0" rx="5" ry="5" width="350" height="150" />
    <Rect x="20" y="160" rx="5" ry="5" width="350" height="150" />
    <Rect x="20" y="320" rx="5" ry="5" width="350" height="150" />
    <Rect x="20" y="480" rx="5" ry="5" width="350" height="150" />
    <Rect x="20" y="640" rx="5" ry="5" width="350" height="150" />
  </ContentLoader>
);

export default WorkoutPromiseLoader;
