import Link from 'src/icons/Link';
import Tooltip from 'src/components/common/Tooltip';

type Props = {
  accountLink?: string;
  accountId?: string;
  handleConnect: () => void;
};

const LinkSpotifyAccount = ({
  accountLink,
  accountId,
  handleConnect,
}: Props) => {
  return (
    <div className="flex flex-col items-center gap-[5px]">
      <img
        src="src/assets/spotify/full_logo_green.png"
        className="w-[150px] "
      />
      {accountId ? (
        <div
          className="mt-[5px] flex items-end gap-[5px] 
      group"
        >
          <a
            href={accountLink}
            target="_blank"
            className="text-stone-300 group-hover:cursor-pointer 
        group-hover:border-b-[1px] border-b-spotifyGreen"
          >
            Linked Account: {accountId}
          </a>
          <img
            src="src/assets/arrow_outward.png"
            className="w-[15px] h-[15px] transform transition-transform 
        duration-300 group-hover:-translate-y-2 ease-in-out"
          />
        </div>
      ) : (
        <Tooltip text="Link Spotify Account" position="bottom">
          <Link onClick={handleConnect} />
        </Tooltip>
      )}
    </div>
  );
};

export default LinkSpotifyAccount;
