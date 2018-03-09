/*
 *  ------------------------------------------------------------------------------------
 *  * Copyright (c) SAS Institute Inc.
 *  *  Licensed under the Apache License, Version 2.0 (the "License");
 *  * you may not use this file except in compliance with the License.
 *  * You may obtain a copy of the License at
 *  *
 *  * http://www.apache.org/licenses/LICENSE-2.0
 *  *
 *  *  Unless required by applicable law or agreed to in writing, software
 *  * distributed under the License is distributed on an "AS IS" BASIS,
 *  * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  * See the License for the specific language governing permissions and
 *  limitations under the License.
 * ----------------------------------------------------------------------------------------
 *
 */

'use strict';

let restaf     = require ('restaf');
let payload = require ('./config')('restaf.env');
let prtUtil = require ('../prtUtil');

// Keys to the kingdom
// Create the restaf
let store = restaf.initStore();

// function to loop thru the list of files and print their id
// scrollCount limits number of 'next' calls

async function example (store, logonPayload, counter) {
    let msg  = await store.logon(logonPayload);
    let root = await store.addServices('reports');

    let reports = await store.apiCall(root.links('reports'));
    prtUtil.view(reports, 'List of reports');
    let next;
    // do this loop while the service returns the next link or counter is 0
    while(((next = reports.scrollCmds('next')) !== null) && --counter > 0)  {
        reports = await store.apiCall(next);
        prtUtil.view(reports);
    }

    return 'All Done';
}

const printList =  (itemsList) => console.log(JSON.stringify(itemsList, null, 4));

example(store, payload, 2)
   .then (status => console.log(status))
   .catch(err => console.log(err));
