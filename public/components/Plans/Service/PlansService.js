import * as ProfileService from '../../Profile/profile.service';
import * as LanguageService from '../../Language/language.service';
export async function GetMenus() {
    let Profile = await ProfileService.getProfile();
    let menus = Profile.menus;
    let output = [];
    for (let i = 0; i < menus.length; i++) {
        let LanguageID;
        let Language;
        if (menus[i].originalLanguages[0]) {
            LanguageID = menus[i].originalLanguages[0].BranchLanguageID;
        }
        if (menus[i].originalLanguages[0]) {
            Language = menus[i].originalLanguages[0].Language.Title
        }

        output.push({ key: menus[i].MenuID, text: menus[i].Title, value: menus[i].MenuID, languageID: LanguageID, language: Language })
    }
    return output;
}

export async function GetLanguages() {
    let Languages = await LanguageService.getLanguages();
    //console.log(Languages);

    let output = [];
    for (let i = 0; i < Languages.length; i++) {
        output.push({ key: Languages[i].LanguageID, text: Languages[i].Title, value: Languages[i].LanguageID })
    }
    return output;
}