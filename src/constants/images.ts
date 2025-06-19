export const COURSE_IMAGES = {
  REACT_BASICS: '/images/courses/react-basics.jpg',
  ADVANCED_JS: '/images/courses/advanced-js.jpg',
  TYPESCRIPT: '/images/courses/typescript.jpg',
  NODEJS: '/images/courses/nodejs.jpg',
} as const;

export const DEFAULT_COURSE_IMAGE = '/images/courses/default-course.jpg';

export const PROFILE_IMAGES = {
  DEFAULT_AVATAR: '/images/avatars/default-avatar.jpg',
} as const;

// Image dimensions for optimization
export const IMAGE_DIMENSIONS = {
  COURSE_THUMBNAIL: {
    width: 600,
    height: 400,
  },
  AVATAR: {
    width: 200,
    height: 200,
  },
} as const;
