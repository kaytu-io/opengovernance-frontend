import {
    ArrowTopRightOnSquareIcon,
    BanknotesIcon,
    ChevronRightIcon,
    CubeIcon,
    CursorArrowRaysIcon,
    PuzzlePieceIcon,
    ShieldCheckIcon,
} from '@heroicons/react/24/outline'
import { Card, Flex, Grid, Icon, Text, Title } from '@tremor/react'
import { useNavigate, useParams } from 'react-router-dom'
import Check from '../../../icons/Check.svg'
import User from '../../../icons/User.svg'
import Dollar from '../../../icons/Dollar.svg'
import Cable from '../../../icons/Cable.svg'
import Cube from '../../../icons/Cube.svg'
import Checkbox from '@cloudscape-design/components/checkbox'
import { link } from 'fs'
import { useEffect, useState } from 'react'
import axios from 'axios'
import ReactMarkdown from 'react-markdown'
interface Props {
    setLoading: Function
}


export default function License({ setLoading }: Props) {
    const workspace = useParams<{ ws: string }>().ws
    const navigate = useNavigate()
    const [checked, setChecked] = useState(false)
        const [markdown, setMarkdown] = useState('')
// 
    //     const [markdown, setMarkdown] = useState(
    //         `Elastic License 2.0

    // URL: [link](https://www.elastic.co/licensing/elastic-license)

    // ## Acceptance

    // By using the software, you agree to all of the terms and conditions below.

    // ## Copyright License

    // The licensor grants you a non-exclusive, royalty-free, worldwide,
    // non-sublicensable, non-transferable license to use, copy, distribute, make
    // available, and prepare derivative works of the software, in each case subject to
    // the limitations and conditions below.

    // ## Limitations

    // You may not provide the software to third parties as a hosted or managed
    // service, where the service provides users with access to any substantial set of
    // the features or functionality of the software.

    // You may not move, change, disable, or circumvent the license key functionality
    // in the software, and you may not remove or obscure any functionality in the
    // software that is protected by the license key.

    // You may not alter, remove, or obscure any licensing, copyright, or other notices
    // of the licensor in the software. Any use of the licensor’s trademarks is subject
    // to applicable law.

    // ## Patents

    // The licensor grants you a license, under any patent claims the licensor can
    // license, or becomes able to license, to make, have made, use, sell, offer for
    // sale, import and have imported the software, in each case subject to the
    // limitations and conditions in this license. This license does not cover any
    // patent claims that you cause to be infringed by modifications or additions to
    // the software. If you or your company make any written claim that the software
    // infringes or contributes to infringement of any patent, your patent license for
    // the software granted under these terms ends immediately. If your company makes
    // such a claim, your patent license ends immediately for work on behalf of your
    // company.

    // ## Notices

    // You must ensure that anyone who gets a copy of any part of the software from you
    // also gets a copy of these terms.

    // If you modify the software, you must include in any modified copies of the
    // software prominent notices stating that you have modified the software.

    // ## No Other Rights

    // These terms do not imply any licenses other than those expressly granted in
    // these terms.

    // ## Termination

    // If you use the software in violation of these terms, such use is not licensed,
    // and your licenses will automatically terminate. If the licensor provides you
    // with a notice of your violation, and you cease all violation of this license no
    // later than 30 days after you receive that notice, your licenses will be
    // reinstated retroactively. However, if you violate these terms after such
    // reinstatement, any additional violation of these terms will cause your licenses
    // to terminate automatically and permanently.

    // ## No Liability

    // *As far as the law allows, the software comes as is, without any warranty or
    // condition, and the licensor will not be liable to you for any damages arising
    // out of these terms or the use or nature of the software, under any kind of
    // legal claim.*

    // ## Definitions

    // The **licensor** is the entity offering these terms, and the **software** is the
    // software the licensor makes available under these terms, including any portion
    // of it.

    // **you** refers to the individual or entity agreeing to these terms.

    // **your company** is any legal entity, sole proprietorship, or other kind of
    // organization that you work for, plus all organizations that have control over,
    // are under the control of, or are under common control with that
    // organization. **control** means ownership of substantially all the assets of an
    // entity, or the power to direct its management and policies by vote, contract, or
    // otherwise. Control can be direct or indirect.

    // **your licenses** are all the licenses granted to you for the software under
    // these terms.

    // **use** means anything you do with the software requiring one of your licenses.

    // **trademark** means trademarks, service marks, and similar rights.`
    //     )
    useEffect(() => {
        const config = {
            headers: {
                'Content-Type': 'text/plain',
            },
            withCredentials: false,
        }
        axios
            .get(
                'https://raw.githubusercontent.com/kaytu-io/open-governance/refs/heads/main/LICENSE.md',
                config
            )
            .then((res) => {
                setMarkdown(res.data)
            })
    }, [])
    return (
        <Card>
            <Flex
                className="gap-2"
                flexDirection="col"
                justifyContent="start"
                alignItems="start"
            >
                <ReactMarkdown
                    children={markdown}
                    // linkTarget="_blank"
                    // transformLinkUri={undefined}
                />

                <Checkbox
                    onChange={({ detail }) => {
                        setChecked(detail.checked)
                        setLoading(!detail.checked)
                    }}
                    checked={checked}
                >
                    I Acknowledge That I Have Read And Understand The Terms
                </Checkbox>
            </Flex>
        </Card>
    )
}
