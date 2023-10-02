import styled from "@emotion/styled";
import {
  Plus,
  Minus,
  Search,
  Heart,
  Edit,
  Trash2,
  ChevronsLeft,
  ChevronLeft,
  ChevronRight,
  ChevronsRight,
} from "react-feather";

interface Props {
  id: keyof typeof icons;
  color?: string;
  size: string | number;
  strokeWidth?: string | number;
}

const icons = {
  plus: Plus,
  minus: Minus,
  heart: Heart,
  edit: Edit,
  trash: Trash2,
  search: Search,
  "chevrons-left": ChevronsLeft,
  "chevron-left": ChevronLeft,
  "chevron-right": ChevronRight,
  "chevrons-right": ChevronsRight,
};

export default function Icon({
  id,
  color,
  size,
  strokeWidth,
  ...delegated
}: Props) {
  const Component = icons[id];

  if (!Component) throw new Error(`Unknown id provided to Icon: ${id}`);

  return (
    <Wrapper strokeWidth={strokeWidth} {...delegated}>
      <Component color={color} size={size} />
    </Wrapper>
  );
}

const Wrapper = styled.div<{ strokeWidth?: string | number }>`
  & > svg {
    display: block;
    stroke-width: ${(p) => p.strokeWidth}px;
  }
`;
