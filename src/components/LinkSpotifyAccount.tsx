import { ForwardedRef, forwardRef } from 'react';
import Link from 'src/icons/Link';
import AccountIcon from 'src/icons/Account';
import Tooltip from 'src/components/common/Tooltip';

type Props = {
  accountLink?: string;
  accountId?: string;
  handleConnect: () => void;
  animate: boolean;
};

const LinkSpotifyAccount = forwardRef(
  (
    { accountLink, accountId, handleConnect, animate }: Props,
    ref: ForwardedRef<HTMLDivElement>
  ) => {
    return (
      <div
        ref={ref}
        className={`flex flex-col items-center gap-[10px] px-4 py-3 
          rounded-lg ${animate ? '' : ''}`}
      >
        <img
          src="src/assets/spotify/full_logo_green.png"
          className="w-[150px] "
        />
        {accountId ? (
          <div className="flex flex-col items-center gap-[10px]">
            <div
              className="mt-[5px] flex items-end gap-[5px] 
      group"
            >
              <a
                href={accountLink}
                target="_blank"
                className="text-stone-400 border-b-[1px] border-transparent
               group-hover:cursor-pointer group-hover:border-b-[1px] 
               group-hover:border-b-spotifyGreen flex gap-[10px]"
              >
                <AccountIcon />
                <span className="text-stone-300">{accountId}</span>
              </a>
              <img
                src="src/assets/arrow_outward.png"
                className="w-[15px] h-[15px] transform transition-transform 
        duration-300 group-hover:-translate-y-2 ease-in-out"
              />
            </div>
            <button
              className="text-stone-300 text-sm border-[1px] px-2 py-1
              border-stone-600 rounded-lg"
            >
              Manage
            </button>
          </div>
        ) : (
          <div className="mt-[5px] flex items-center gap-[10px]">
            <p className="text-stone-400 pb-[2px]">Link Account:</p>
            <Tooltip text="Link Spotify Account" position="bottom">
              <Link onClick={handleConnect} width={25} height={25} />
            </Tooltip>
          </div>
        )}
      </div>
    );
  }
);

export default LinkSpotifyAccount;
