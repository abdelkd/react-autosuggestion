import clsx, { ClassArray } from 'clsx';
import { twMerge } from 'tw-merge'

export function cn(...classes: ClassArray) {
  return twMerge(clsx(classes))
}
