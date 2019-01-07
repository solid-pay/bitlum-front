/**
 * Component to display name and button for name generation
 *
 */

// -----------------------------------------------------------------------------
// Dependencies
// -----------------------------------------------------------------------------

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import formatDate from 'date-fns/format';
import isToday from 'date-fns/is_today';
import isYesteray from 'date-fns/is_yesterday';

import NavLink from 'react-router-dom';

import log from 'utils/logging';

import {
  Root,
  P,
  Span,
  Status,
  Img,
  Details,
  DetailsItem,
  MainInfo,
  AdditionalInfo,
  Vendor,
  Tip,
  CopyButton,
  Button,
  A,
} from './styles';
import { payments } from '../../stores/data';

// -----------------------------------------------------------------------------
// Code
// -----------------------------------------------------------------------------

const getDate = date => {
  let distance;
  distance = formatDate(new Date(date), 'Do MMMM [at] HH:mm');
  if (isToday(date)) {
    distance = formatDate(new Date(date), '[Today at] HH:mm');
  }
  if (isYesteray(date)) {
    distance = formatDate(new Date(date), '[Yesterday at] HH:mm');
  }
  return distance;
};

const blockchainExplorers = {
  BTC: process.env.NODE_ENV === 'development' ? 'https://chain.so/tx/BTCTEST/' : 'https://chain.so/tx/BTC/',
};

export const PaymentItem = ({
  className,
  puid,
  type,
  txid,
  asset,
  direction,
  denominations,
  description,
  receipt,
  status,
  vuid,
  vendorIcon,
  vendorColor,
  vendorName,
  updatedAt,
  t,
}) => {
  return (
    <Root className={className}>
      <MainInfo>
        <Vendor color={vendorColor}>
          <Img src={vendorIcon}/>
          <P>
            <Span>
              {`${direction === 'incoming' ? 'Received from' : 'Sent to'}`}{' '}
              {vendorName}
            </Span>
            <Span>{`${getDate(updatedAt)}`}</Span>
          </P>

          <Status status={status}>{`${status[0].toUpperCase()}${status.slice(1)}`}</Status>
        </Vendor>
        <Details>
          <DetailsItem align="right">
            <P>Amount</P>
            <P>
              <Span>
                {denominations.main.toString({omitDirection: true}).amount}
              </Span>
              <Span>
                {denominations.additional.toString({omitDirection: true}).amount}
              </Span>
            </P>
          </DetailsItem>
          <DetailsItem align="right">
            {/* <Tip>Temporary Fee tips</Tip> */}
            <P>Fee</P>
            <P>
              <Span>
                {denominations.main.toString({omitDirection: true}).fees}
              </Span>
              <Span>
                {denominations.additional.toString({omitDirection: true}).fees}
              </Span>
            </P>
          </DetailsItem>
          <DetailsItem accent align="right" direction={direction}>
            <P>Total</P>
            <P>
              <Span>
                {denominations.main.toString({omitDirection: true}).total}
              </Span>
              <Span>
                {denominations.additional.toString({omitDirection: true}).total}
              </Span>
            </P>
          </DetailsItem>
          <DetailsItem>
            <P>Description</P>
            <P>
              <Span unreadable={!description}>{description || 'No description'}</Span>
            </P>
            {description ? <CopyButton data={description || receipt} /> : null}
          </DetailsItem>
        </Details>
      </MainInfo>
      <AdditionalInfo>
        <Details>
          {type === 'blockchain' && (
            <DetailsItem>
              {/* <Tip>Temporary Invoice tips</Tip> */}
              <P>From</P>
              <P>
                <Span unreadable>{vuid}</Span>
              </P>
              <CopyButton data={vuid} />
            </DetailsItem>
          )}
          <DetailsItem>
            {/* <Tip>Temporary Invoice tips</Tip> */}
            <P>{type === 'blockchain' ? 'To' : 'Invoice'}</P>
            <P>
              <Span unreadable>{receipt}</Span>
            </P>
            <CopyButton data={receipt} />
          </DetailsItem>
          <DetailsItem>
            {/* <Tip>Temporary Preimage tips</Tip> */}
            <P>{type === 'blockchain' ? 'Transaction ID' : 'Preimage'}</P>
            <P>
              <Span unreadable>NEED TO SAVE PREIMAGE FROM PAYSERVEEEEER</Span>
              {type === 'blockchain' && (
                <Button link>
                  <A href={`${blockchainExplorers[asset]}${txid}`} target="_blank">
                    Open in explorer
                  </A>
                </Button>
              )}
            </P>
            <CopyButton data={txid} />
          </DetailsItem>
        </Details>
      </AdditionalInfo>
    </Root>
  );
};

PaymentItem.propTypes = {};

PaymentItem.defaultProps = {};

export default PaymentItem;
