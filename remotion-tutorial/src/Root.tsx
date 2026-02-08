import { Composition } from 'remotion';
import { CoachTutorial } from './CoachTutorial';

export const RemotionRoot: React.FC = () => {
    return (
        <>
            <Composition
                id="CoachDashboardTutorial"
                component={CoachTutorial}
                durationInFrames={1350} // 45 seconds at 30fps
                fps={30}
                width={1920}
                height={1080}
            />
        </>
    );
};
