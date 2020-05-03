import React, { useRef } from 'react';
import { Header } from './header';
import { Footer } from './footer';
import { AppContextHolder } from '../../internal/app-context';
import { Toaster } from '@blueprintjs/core';
import classNames from 'classnames';

export const Layout: React.FC = props => {
  const toasterRef = useRef<Toaster>(null!);
  return (
    <AppContextHolder toasterRef={toasterRef}>
      <Toaster ref={toasterRef} position="bottom" />
      {/* root of "our" dom */}
      <div className="h-screen flex flex-col">
        <Header here={'HERE'} />
        <div className="flex-grow z-0 overflow-y-scroll">
          <MainContent>{props.children}</MainContent>
        </div>
        <Footer />
      </div>
    </AppContextHolder>
  );
};

export const MainContent: React.FC = props => <div className="container mx-auto">{props.children}</div>;

export const CenterH: React.FC<{ className?: string }> = props => {
  const containerClass = classNames('flex', props.className || '');
  return (
    <div className={containerClass}>
      <div className="mx-auto inline-flex self-center">{props.children}</div>
    </div>
  );
};
