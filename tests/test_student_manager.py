
from pathlib import Path

from playwright.sync_api import Page, expect


def test_add_student_update_count(page: Page):
    html_file = Path(__file__).resolve().parent.parent / "index.html"
    page.goto(html_file.as_uri())

    # Check the initial student count.
    expect(page.locator("#totalCount")).to_have_text("3")

    # Fill in the student details.
    page.locator("#name").fill("Test Student")
    page.locator("#roll").fill("IT100")
    page.locator("#course").select_option(label="B.Tech IT")
    page.locator("#mark").fill("85")

    # Add the student.
    page.get_by_role("button", name="Add student").click()

    # Verify the result.
    expect(page.get_by_text("Student added successfully.")).to_be_visible()
    expect(page.locator("#totalCount")).to_have_text("4")
    expect(page.locator("#studentRows")).to_contain_text("Test Student")
    expect(page.locator("#studentRows")).to_contain_text("IT100")

def test_search_student(page: Page):
    html_file = Path(__file__).resolve().parent.parent / "index.html"
    page.goto(html_file.as_uri())

    # Search for an existing student
    page.get_by_role("textbox", name="Search students").fill("Priya")

    # Verify that the matching student appears
    expect(page.locator("#studentRows")).to_contain_text("Priya")
    expect(page.locator("#studentRows")).not_to_contain_text("student name")


def test_delete_student(page: Page):
    html_file = Path(__file__).resolve().parent.parent / "index.html"
    page.goto(html_file.as_uri())

    priya_row = page.locator("#studentRows tr").filter(
        has_text="Priya Kumar"
    )

    expect(priya_row).to_be_visible()

    # Automatically accept the browser confirmation dialog.
    page.once("dialog", lambda dialog: dialog.accept())

    # Delete Priya.
    priya_row.get_by_role("button", name="Delete").click()

    # Verify the student was removed.
    expect(page.locator("#studentRows")).not_to_contain_text("Priya Kumar")

    # Verify the count decreased.
    expect(page.locator("#totalCount")).to_have_text("2")

    # Verify the success message.
    expect(page.locator("#message")).to_contain_text("Student deleted.")


def test_edit_student(page: Page):
    html_file = Path(__file__).resolve().parent.parent / "index.html"
    page.goto(html_file.as_uri())

    # Find Priya's row and click Edit.
    priya_row = page.locator("#studentRows tr").filter(
        has_text="Priya Kumar"
    )
    priya_row.get_by_role("button", name="Edit").click()

    # Update her name and mark.
    page.locator("#name").fill("Priya Kumar Updated")
    page.locator("#mark").fill("95")

    # Save the changes.
    page.get_by_role("button", name="Save changes").click()

    # Verify the updated record.
    expect(page.locator("#studentRows")).to_contain_text(
        "Priya Kumar Updated"
    )
    expect(page.locator("#studentRows")).to_contain_text("95/100")
    expect(page.locator("#totalCount")).to_have_text("3")
