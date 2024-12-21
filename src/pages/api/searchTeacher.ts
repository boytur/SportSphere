import { mockUserData } from '@/mock/mock_user_data';

import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {

    if (req.method === 'GET') {        
        const { username } = (req.query) as { username: string };

        try {
            const user = await mockUserData.find((user) => user.name.includes(username));
            const team_members = await mockUserData.filter((data) => data.team == user?.team);
            
            if(user?.position == 'นิสิต') res.status(404).json({ success: false, message: 'ไม่พบข้อมูล' });
            
            res.status(200).json({
                success: true,
                data: {
                    username: user?.username,
                    fullName: user?.name,
                    role: user?.position,
                    teamName: mapTeamName(user?.team ?? 'Unknown'),
                    teamColor: user?.team,
                    members: team_members,
                },
            });
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
            res.status(500).json({ success: false, message: errorMessage });
        }
    } else {
        res.setHeader('Allow', ['GET']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}

function mapTeamName(teamColor: string) {
    // ชมพู	เอราวัณ
    // แดง	หงส์เพลิง
    // เหลือง	กิเลนทองคำ
    // เขียว	นาคา
    // น้ำเงิน	สุบรรณนที
    switch (teamColor) {
        case 'ชมพู':
            return 'เอราวัณ';
        case 'แดง':
            return 'หงส์เพลิง';
        case 'เหลือง':
            return 'กิเลนทองคำ';
        case 'เขียว':
            return 'นาคา';
        case 'น้ำเงิน':
            return 'สุบรรณนที';
        default:
            return 'Unknown';
    }
}

