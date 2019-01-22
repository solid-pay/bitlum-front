/**
 * Component to display name and button for name generation
 *
 */

// -----------------------------------------------------------------------------
// Dependencies
// -----------------------------------------------------------------------------

import styled from 'styled-components';
import { withLoader, Form, Button, Message, A, P } from 'components/common';

// -----------------------------------------------------------------------------
// Code
// -----------------------------------------------------------------------------

export * from 'components/common';

export const Root = withLoader(styled(Form)`
  & ${A} {
    cursor: pointer;
    font-weight: 500;
    color: var(--colors__bg_accent);
  }

  & ${Button} {
    height: 2.7em;
  }
  & ${Message} {
    margin: 1em 0;
  }
  & > ${P} {
    margin-left: 0.3em;
    font-size: 0.8em;
    font-weight: 500;
    color: var(--colors__text_dark);
    margin-top: 1em;
    white-space: pre-line;
  }
`);

export default Root;
